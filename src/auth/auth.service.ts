import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Response } from 'express';
import ErrorsTypes from 'src/errors/errors.enum';
import { GlobalException } from 'src/exceptions/global.exception';
import { EmailUpdateDto, LoginDto, RegisterDto } from './dto';

import { CurrentUserType } from 'src/common/types/CurrentUser.type';
import { PrismaService } from '../prisma/prisma.service';
import { VerificationSerivce } from './verification.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly verificationService: VerificationSerivce,
    private readonly config: ConfigService
  ) {}

  async register(registerDto: RegisterDto) {
    try {
      const { email, password, confirm_password } = registerDto;
      const findUser = await this.prismaService.user.findUnique({ where: { email } });

      if (findUser) throw new BadRequestException('This email is already in use! Please try again');

      if (password !== confirm_password)
        throw new BadRequestException('Passwords do not match! Please try again');

      const hashed_password: string = await bcrypt.hash(password, 12);

      const newUser = await this.prismaService.user.create({
        data: { email, password: hashed_password },
      });
      const tokens = await this.getTokens(newUser.id, newUser.email, newUser.role);
      const hashedRefreshToken = await bcrypt.hash(tokens.refresh_token, 12);
      const activationLink = await this.verificationService.send(newUser.email);

      await this.prismaService.user.update({
        data: { hashedRefreshToken, activationLink },
        where: { id: newUser.id },
      });
      return {
        success: true,
        message: 'User created successfully, please check your email to verify your account',
      };
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new GlobalException(ErrorsTypes.AUTH_FAILED_TO_REGISTER, error.message);
    }
  }

  async login(loginDto: LoginDto, res: Response) {
    try {
      const { email, password } = loginDto;
      const user = await this.validateUser(email);
      const isMatchPass = await bcrypt.compare(password, user.password);
      if (!isMatchPass) throw new BadRequestException('User not found');

      const tokens = await this.getTokens(user.id, user.email, user.role);
      const hashedRefreshToken = await bcrypt.hash(tokens.refresh_token, 12);

      await this.prismaService.user.update({
        data: { hashedRefreshToken },
        where: { id: user.id },
      });

      this.setRefreshTokenCookie(tokens.refresh_token, res);
      return { tokens, id: user.id };
    } catch (error) {
      if (error instanceof UnauthorizedException || error instanceof BadRequestException)
        throw error;
      throw new GlobalException(ErrorsTypes.AUTH_FAILED_TO_LOGIN, error.message);
    }
  }

  async logout(refreshToken: string, res: Response) {
    try {
      const adminData = await this.jwtService.verify(refreshToken, {
        secret: process.env.REFRESH_TOKEN_KEY,
      });

      if (!adminData) throw new ForbiddenException('User not found');

      await this.prismaService.user.update({
        data: { hashedRefreshToken: null },
        where: { id: adminData.sub },
      });

      res.clearCookie('refresh_token');
      const response = {
        message: 'User logged out successfully',
      };
      return response;
    } catch (error) {
      if (error instanceof ForbiddenException) throw error;
      throw new GlobalException(ErrorsTypes.AUTH_FAILED_TO_LOGOUT, error.message);
    }
  }

  async refreshToken(userId: string, refreshToken: string, res: Response) {
    try {
      const decodedToken = await this.jwtService.verify(refreshToken, {
        secret: process.env.REFRESH_TOKEN_KEY,
      });

      if (!decodedToken) throw new BadRequestException('Invalid refresh token');

      if (userId != decodedToken['sub']) throw new BadRequestException('User not found');

      const user = await this.prismaService.user.findFirst({
        where: { id: userId },
      });
      if (!user || !user.hashedRefreshToken) throw new BadRequestException('User not found');

      const tokenMatch = await bcrypt.compare(refreshToken, user.hashedRefreshToken);

      if (!tokenMatch) throw new ForbiddenException('Forbidden');

      const tokens = await this.getTokens(user.id, user.email, user.role);
      const hashedRefreshToken = await bcrypt.hash(tokens.refresh_token, 12);
      await this.prismaService.user.update({
        data: { hashedRefreshToken },
        where: { id: userId },
      });

      this.setRefreshTokenCookie(tokens.refresh_token, res);
      return {
        tokens,
        message: 'Tokens have been refreshed successfully',
      };
    } catch (error) {
      if (error instanceof TokenExpiredError)
        throw new UnauthorizedException('Refresh token expired');

      if (error instanceof BadRequestException || error instanceof ForbiddenException) throw error;
      throw new GlobalException(ErrorsTypes.AUTH_FAILED_TO_REFRESH_TOKENS, error.message);
    }
  }

  async updateEmailRequest(emailUpdateDto: EmailUpdateDto, user: CurrentUserType) {
    try {
      const { email: newEmail } = emailUpdateDto;

      if (user.email === newEmail) {
        if (user.isEmailVerified) throw new BadRequestException('You already verified this email!');
      } else {
        const findUser = await this.prismaService.user.findUnique({ where: { email: newEmail } });
        if (findUser) throw new ConflictException('This email is already in use! Please try again');
      }

      const activationLink = await this.verificationService.send(newEmail);
      await this.prismaService.user.update({
        data: { activationLink, email: newEmail, isEmailVerified: false },
        where: { id: user.id },
      });
      return {
        message: 'Email update request sent',
      };
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof ConflictException) throw error;
      throw new GlobalException(ErrorsTypes.AUTH_FAILED_TO_UPDATE_EMAIL, error.message);
    }
  }

  /** SET REFRESH TOKEN COKKIE PRIVATE FUNCTION */
  private setRefreshTokenCookie(refresh_token: string, res: Response) {
    const maxAge = parseInt(process.env.MAX_REFRESH_TOKEN_AGE || '0', 10);
    res.cookie('refresh_token', refresh_token, {
      maxAge,
      httpOnly: true,
      sameSite: this.config.get('COOKIE_SAME_SITE') as 'strict' | 'lax' | 'none' | undefined,
      secure: this.config.get('COOKIE_SECURE') === 'true',
    });
  }
  /** VALIDATE USER HELPER FUNCTION */
  async validateUser(email: string) {
    try {
      const user = await this.prismaService.user.findUnique({ where: { email } });
      if (!user) throw new UnauthorizedException('User not found');
      if (!user.isEmailVerified) throw new BadRequestException('User Email not Verified');
      return user;
    } catch (error) {
      if (error instanceof UnauthorizedException || error instanceof BadRequestException)
        throw error;
      throw new GlobalException(ErrorsTypes.AUTH_FAILED_TO_VALIDATE, error.message);
    }
  }
  // GET TOKENS METHOD
  async getTokens(sub: string, email: string, role: string) {
    const jwtPayload: { sub: string; email: string; role: string } = {
      sub,
      email,
      role,
    };

    try {
      const [accessToken, refreshToken] = await Promise.all([
        this.jwtService.signAsync(jwtPayload, {
          secret: process.env.ACCESS_TOKEN_KEY,
          expiresIn: process.env.ACCESS_TOKEN_TIME,
        }),
        this.jwtService.signAsync(jwtPayload, {
          secret: process.env.REFRESH_TOKEN_KEY,
          expiresIn: process.env.REFRESH_TOKEN_TIME,
        }),
      ]);
      return {
        access_token: accessToken,
        refresh_token: refreshToken,
      };
    } catch (error) {
      throw new GlobalException(ErrorsTypes.AUTH_FAILED_TO_GET_TOKENS, error.message);
    }
  }
}

import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, RegisterDto } from './dto';
import { Response } from 'express';
import * as bcrypt from 'bcryptjs';
import { VerificationSerivce } from './verification.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly verificationService: VerificationSerivce
  ) {}

  async register(registerDto: RegisterDto, res: Response) {
    const { email, password, confirm_password } = registerDto;
    const findUser = await this.prismaService.user.findUnique({ where: { email } });
    if (findUser) {
      throw new BadRequestException('This email is already in use! Please try again');
    }
    if (password !== confirm_password) {
      throw new BadRequestException('Passwords do not match! Please try again');
    }
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
    this.setRefreshTokenCookie(tokens.refresh_token, res);
    return tokens;
  }
  async login(loginDto: LoginDto, res: Response) {
    const { email, password } = loginDto;
    const user = await this.validateUser(email);
    const isMatchPass = await bcrypt.compare(password, user.password);
    if (!isMatchPass) throw new UnauthorizedException('User not found');

    const tokens = await this.getTokens(user.id, user.email, user.role);
    const hashedRefreshToken = await bcrypt.hash(tokens.refresh_token, 12);

    await this.prismaService.user.update({
      data: { hashedRefreshToken },
      where: { id: user.id },
    });
    this.setRefreshTokenCookie(tokens.refresh_token, res);
    return tokens;
  }
  async logout(refreshToken: string, res: Response) {
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
      message: 'User logged put successfully',
    };
    return response;
  }

  async refreshToken(userId: string, refreshToken: string, res: Response) {
    const decodedToken = this.jwtService.decode(refreshToken);

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

    res.cookie('refresh_token', tokens.refresh_token, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    return {
      tokens,
      message: 'Tokens have been refreshed successfully',
    };
  }

  /** SET REFRESH TOKEN COKKIE PRIVATE FUNCTION */
  private setRefreshTokenCookie(refresh_token: string, res: Response) {
    const maxAge = parseInt(process.env.MAX_REFRESH_TOKEN_AGE || '0', 10);
    res.cookie('refresh_token', refresh_token, {
      maxAge,
      httpOnly: true,
    });
  }
  /** VALIDATE USER HELPER FUNCTION */
  async validateUser(email: string) {
    const user = await this.prismaService.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('User not found');
    if (!user.isEmailVerified) throw new BadRequestException('User Email not Verified');
    return user;
  }
  // GET TOKENS METHOD
  async getTokens(sub: string, email: string, role: string) {
    const jwtPayload: { sub: string; email: string; role: string } = {
      sub,
      email,
      role,
    };
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
  }
}

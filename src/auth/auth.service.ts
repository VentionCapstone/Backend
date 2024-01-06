import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Response } from 'express';
import ErrorsTypes from 'src/errors/errors.enum';
import { GlobalException } from 'src/exceptions/global.exception';
import {
  EmailUpdateDto,
  ForgotPasswordEmailDto,
  ForgotPasswordResetDto,
  LoginDto,
  RegisterDto,
} from './dto';

import { I18nService } from 'nestjs-i18n';
import { AuthUser } from 'src/common/types/AuthUser.type';
import { translateMessage } from 'src/helpers/translateMessage.helper';
import { MailerService } from 'src/mailer/mailer.service';
import MessagesTypes from 'src/messages/messages.enum';
import { PrismaService } from '../prisma/prisma.service';
import { PasswordUpdateDto } from './dto/update-password.dto';
import { VerificationSerivce } from './verification.service';

const {
  SALT_LENGTH,
  FORGOT_PASSWORD_RESET_TOKEN_KEY,
  FORGOT_PASSWORD_RESET_TOKEN_EXPIRY,
  MAX_HASH_LENGTH,
} = process.env;

const MaxHashLength = parseInt(MAX_HASH_LENGTH!);
const SaltLength = parseInt(SALT_LENGTH!);

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly verificationService: VerificationSerivce,
    private readonly config: ConfigService,
    private readonly i18n: I18nService,
    private readonly mailerService: MailerService
  ) {}

  async register(registerDto: RegisterDto) {
    try {
      const { email, password, confirm_password } = registerDto;
      const findUser = await this.prismaService.user.findUnique({ where: { email } });

      if (findUser)
        throw new BadRequestException(ErrorsTypes.BAD_REQUEST_AUTH_EMAIL_ALREADY_IN_USE);

      if (password !== confirm_password)
        throw new BadRequestException(ErrorsTypes.BAD_REQUEST_AUTH_PASSWORDS_DONT_MATCH);

      const hashed_password: string = await bcrypt.hash(
        password,
        parseInt(this.config.get('SALT_LENGTH')!)
      );

      const newUser = await this.prismaService.user.create({
        data: { email, password: hashed_password },
      });
      const tokens = await this.getTokens(newUser.id, newUser.email, newUser.role);
      const hashedRefreshToken = await bcrypt.hash(
        tokens.refresh_token,
        parseInt(this.config.get('SALT_LENGTH')!)
      );
      const activationLink = await this.verificationService.send(newUser.email);

      await this.prismaService.user.update({
        data: { hashedRefreshToken, activationLink },
        where: { id: newUser.id },
      });
      return {
        success: true,
        message: translateMessage(this.i18n, MessagesTypes.AUTH_REGISTER_SUCCESS),
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
      if (!isMatchPass) throw new BadRequestException(ErrorsTypes.NOT_FOUND_AUTH_USER);

      const tokens = await this.getTokens(user.id, user.email, user.role);
      const hashedRefreshToken = await bcrypt.hash(
        tokens.refresh_token,
        parseInt(this.config.get('SALT_LENGTH')!)
      );

      await this.prismaService.user.update({
        data: { hashedRefreshToken },
        where: { id: user.id },
      });

      this.setRefreshTokenCookie(tokens.refresh_token, res);
      return { tokens, id: user.id };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new GlobalException(ErrorsTypes.AUTH_FAILED_TO_LOGIN, error.message);
    }
  }

  async logout(refreshToken: string, res: Response) {
    try {
      const adminData = await this.jwtService.verify(refreshToken, {
        secret: process.env.REFRESH_TOKEN_KEY,
      });

      if (!adminData) throw new ForbiddenException(ErrorsTypes.NOT_FOUND_AUTH_USER);

      await this.prismaService.user.update({
        data: { hashedRefreshToken: null },
        where: { id: adminData.sub },
      });

      res.clearCookie('refresh_token');
      const response = {
        message: translateMessage(this.i18n, MessagesTypes.AUTH_LOGOUT_SUCCESS),
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

      if (!decodedToken)
        throw new BadRequestException(ErrorsTypes.BAD_REQUEST_AUTH_INVALID_REFRESH_TOKEN);

      if (userId != decodedToken['sub'])
        throw new BadRequestException(ErrorsTypes.NOT_FOUND_AUTH_USER);

      const user = await this.prismaService.user.findFirst({
        where: { id: userId },
      });
      if (!user || !user.hashedRefreshToken)
        throw new BadRequestException(ErrorsTypes.NOT_FOUND_AUTH_USER);

      const tokenMatch = await bcrypt.compare(refreshToken, user.hashedRefreshToken);

      if (!tokenMatch) throw new ForbiddenException(ErrorsTypes.FORBIDDEN_INVALID_TOKEN);

      const tokens = await this.getTokens(user.id, user.email, user.role);
      const hashedRefreshToken = await bcrypt.hash(
        tokens.refresh_token,
        parseInt(this.config.get('SALT_LENGTH')!)
      );
      await this.prismaService.user.update({
        data: { hashedRefreshToken },
        where: { id: userId },
      });

      this.setRefreshTokenCookie(tokens.refresh_token, res);
      return {
        tokens,
        success: true,
      };
    } catch (error) {
      if (error instanceof TokenExpiredError)
        throw new UnauthorizedException(ErrorsTypes.UNAUTHORIZED_AUTH_EXPIRED_REFRESH_TOKEN);

      if (error instanceof HttpException) throw error;
      throw new GlobalException(ErrorsTypes.AUTH_FAILED_TO_REFRESH_TOKENS, error.message);
    }
  }

  async updateEmailRequest(emailUpdateDto: EmailUpdateDto, user: AuthUser) {
    try {
      const { email: newEmail } = emailUpdateDto;

      if (user.email === newEmail) {
        if (user.isEmailVerified)
          throw new BadRequestException(ErrorsTypes.BAD_REQUEST_AUTH_EMAIL_ALREADY_VERIFIED);
      } else {
        const findUser = await this.prismaService.user.findUnique({ where: { email: newEmail } });
        if (findUser)
          throw new ConflictException(ErrorsTypes.BAD_REQUEST_AUTH_EMAIL_ALREADY_IN_USE);
      }

      const activationLink = await this.verificationService.send(newEmail);
      await this.prismaService.user.update({
        data: { activationLink, email: newEmail, isEmailVerified: false },
        where: { id: user.id },
      });
      return {
        success: true,
        message: translateMessage(this.i18n, MessagesTypes.AUTH_EMAIL_VERIFICATION_LINK_SENT),
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new GlobalException(ErrorsTypes.AUTH_FAILED_TO_UPDATE_EMAIL, error.message);
    }
  }

  async updatePassword(authUser: AuthUser, body: PasswordUpdateDto, res: Response) {
    try {
      const { oldPassword, newPassword } = body;

      const user = await this.prismaService.user.findUnique({ where: { id: authUser.id } });
      if (!user) throw new BadRequestException(ErrorsTypes.NOT_FOUND_AUTH_USER);

      const isMatchPass = await bcrypt.compare(oldPassword, user.password);
      if (!isMatchPass)
        throw new BadRequestException(ErrorsTypes.BAD_REQUEST_AUTH_INVALID_OLD_PASS);

      const hashed_password: string = await bcrypt.hash(
        newPassword,
        parseInt(this.config.get('SALT_LENGTH')!)
      );
      await this.prismaService.user.update({
        data: { password: hashed_password },
        where: { id: user.id },
      });

      res.clearCookie('refresh_token');

      const activationLink = await this.verificationService.send(user.email);
      await this.prismaService.user.update({
        data: { activationLink, isEmailVerified: false },
        where: { id: user.id },
      });

      return {
        success: true,
        message: translateMessage(this.i18n, MessagesTypes.AUTH_PASSWORD_UPDATE_SUCCESS),
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new GlobalException(ErrorsTypes.AUTH_FAILED_TO_UPDATE_PASSWORD, error.message);
    }
  }

  async forgotPasswordEmail(body: ForgotPasswordEmailDto) {
    try {
      const { email } = body;

      const user = await this.prismaService.user.findUnique({ where: { email: email } });
      if (!user) throw new NotFoundException(ErrorsTypes.NOT_FOUND_AUTH_USER);
      const userId = user.id;
      const token = await this.jwtService.signAsync(
        { userId },
        {
          secret: FORGOT_PASSWORD_RESET_TOKEN_KEY,
          expiresIn: FORGOT_PASSWORD_RESET_TOKEN_EXPIRY,
        }
      );

      const hashedResetToken = await bcrypt.hash(await this.cropTokenIfTooLong(token), SaltLength);

      await this.prismaService.user.update({
        data: { passwordResetToken: hashedResetToken },
        where: { id: user.id },
      });

      const forgotPasswordLink = new URL(
        `/auth/forgot-password-reset?token=${token}`,
        this.config.get('MAILER_CALLBACK_URL')
      );

      await this.mailerService.sendHtmlEmail(
        email,
        'Forgot password',
        `<p> Please use this <a href="${forgotPasswordLink}">link</a> to set a new password. </p>`
      );

      return {
        success: true,
        message: translateMessage(this.i18n, MessagesTypes.AUTH_FORGOT_PASSWORD_EMAIL_SENT),
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new GlobalException(
        ErrorsTypes.AUTH_FORGOT_PASSWORD_FAILED_TO_SEND_EMAIL,
        error.message
      );
    }
  }

  async validateForgotPasswordToken(token: string) {
    try {
      const decodedToken = await this.jwtService.verify(token, {
        secret: process.env.FORGOT_PASSWORD_RESET_TOKEN_KEY,
      });

      if (!decodedToken)
        throw new BadRequestException(ErrorsTypes.FORBIDDEN_FORGOT_PASSWORD_INVALID_TOKEN);

      const user = await this.prismaService.user.findUnique({ where: { id: decodedToken.userId } });

      if (!user) throw new NotFoundException(ErrorsTypes.NOT_FOUND_AUTH_USER);

      if (!user.passwordResetToken)
        throw new BadRequestException(ErrorsTypes.FORBIDDEN_FORGOT_PASSWORD_INVALID_TOKEN);

      const tokenMatch = await bcrypt.compare(
        await this.cropTokenIfTooLong(token),
        user.passwordResetToken
      );

      if (!tokenMatch)
        throw new BadRequestException(ErrorsTypes.FORBIDDEN_FORGOT_PASSWORD_INVALID_TOKEN);

      return user.id;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new GlobalException(ErrorsTypes.AUTH_FAILED_TOKEN_VERIFY, error.message);
    }
  }

  async resetForgotPassword(body: ForgotPasswordResetDto) {
    try {
      const { token, newPassword, confirmPassword } = body;

      if (newPassword !== confirmPassword)
        throw new BadRequestException(ErrorsTypes.BAD_REQUEST_AUTH_PASSWORDS_DONT_MATCH);

      const userId = await this.validateForgotPasswordToken(token);

      const hashed_new_password: string = await bcrypt.hash(
        newPassword,
        parseInt(this.config.get('SALT_LENGTH')!)
      );

      await this.prismaService.user.update({
        data: {
          password: hashed_new_password,
          hashedRefreshToken: null,
          passwordResetToken: null,
        },
        where: { id: userId },
      });

      return {
        success: true,
        message: translateMessage(this.i18n, MessagesTypes.AUTH_FORGOT_PASSWORD_RESET_SUCCESS),
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new GlobalException(ErrorsTypes.AUTH_FAILED_TO_UPDATE_PASSWORD, error.message);
    }
  }

  async cropTokenIfTooLong(token: string) {
    if (token.length > MaxHashLength) {
      return token.slice(-MaxHashLength);
    }
    return token;
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
      if (!user) throw new UnauthorizedException(ErrorsTypes.NOT_FOUND_AUTH_USER);
      if (!user.isEmailVerified)
        throw new BadRequestException(ErrorsTypes.BAD_REQUEST_AUTH_EMAIL_NOT_VERIFIED);
      return user;
    } catch (error) {
      if (error instanceof HttpException) throw error;
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
      throw new GlobalException(ErrorsTypes.AUTH_FAILED_TO_GENERATE_TOKENS, error.message);
    }
  }
}

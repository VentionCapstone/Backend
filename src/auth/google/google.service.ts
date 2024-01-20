import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import ErrorsTypes from 'src/errors/errors.enum';
import { GlobalException } from 'src/exceptions/global.exception';
import { MailerService } from 'src/mailer/mailer.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from '../auth.service';
import { PasswordService } from './password.service';

const { SALT_LENGTH, GOOGLE_CLIENT_ID, GOOGLE_SECRET } = process.env;

const SaltLength = parseInt(SALT_LENGTH!);

const client = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_SECRET);

@Injectable()
export class GoogleService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly passwordService: PasswordService,
    private readonly mailerService: MailerService,
    private readonly authService: AuthService
  ) {}
  async googleLogin(token: string, res: Response) {
    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const user = ticket.getPayload();

      if (!user) {
        throw new UnauthorizedException(ErrorsTypes.AUTH_GOOGLE_FAILED_TO_LOGIN);
      }
      const {
        email,
        sub,
        given_name: firstName,
        family_name: lastName,
        email_verified: isEmailVerified,
      } = user;

      if (!email) {
        throw new UnauthorizedException(ErrorsTypes.AUTH_GOOGLE_FAILED_GET_USER_DATA);
      }
      let userFromDb = await this.prismaService.user.findUnique({
        where: { email },
      });
      const password = this.passwordService.generatePassword();

      if (!userFromDb) {
        const hashedPassword: string = await bcrypt.hash(password, SaltLength);

        userFromDb = await this.prismaService.user.create({
          data: {
            email,
            password: hashedPassword,
            firstName,
            lastName,
            isEmailVerified,
            authSocialSign: sub,
            authType: 'GOOGLE',
          },
        });

        await this.mailerService.sendHtmlEmail(
          email,
          'Your credentials',
          this.generateEmailBody(email, password)
        );
      }

      const tokens = await this.authService.getTokens(userFromDb.id, email, userFromDb.role);
      this.authService.setRefreshTokenCookie(tokens.refresh_token, res);

      return { tokens, id: userFromDb.id };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new GlobalException(ErrorsTypes.AUTH_FAILED_TO_LOGIN, error.message);
    }
  }

  private generateEmailBody(email: string, password: string): string {
    return `
      <div style="border: 2px solid #FF385C; border-radius: 12px; padding: 20px; max-width: 400px; margin: auto;">
        <div style="font-size: 18px; font-weight: bold; margin-bottom: 10px;">
          Your credentials to log in without using Google service (you can also log in with Google)
       </div>
       <div style="font-weight: bold;">Email:</div>
       <div style="margin-bottom: 10px;">${email}</div>
       <div style="font-weight: bold;">Password:</div>
        <div style="margin-bottom: 10px;">${password}</div>
      </div>
`;
  }
}

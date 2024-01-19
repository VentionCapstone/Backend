import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
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
    console.log('GoogleService ~ googleLogin ~ token:', token);

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const user = ticket.getPayload();

    if (!user) {
      return 'ERORR HERE';
    }
    const {
      email,
      sub,
      given_name: firstName,
      family_name: lastName,
      email_verified: isEmailVerified,
    } = user;

    if (!email) {
      console.error('Email not available.');
      return 'ERROR HERE';
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
      console.log('GoogleService ~ googleLogin ~ savedUser:', userFromDb);

      await this.mailerService.sendHtmlEmail(
        email,
        'Your credentials',
        this.generateEmailBody(email, password)
      );
    }

    const tokens = await this.authService.getTokens(userFromDb.id, email, userFromDb.role);
    console.log('GoogleService ~ googleLogin ~ data:', tokens);

    const setRefresh = this.authService.setRefreshTokenCookie(tokens.refresh_token, res);
    console.log('GoogleService ~ googleLogin ~ setRefresh:', setRefresh);
    throw new Error('from back');

    // return { tokens, id: userFromDb.id };
  }

  private generateEmailBody(email: string, password: string): string {
    return `
     <div style="background-color: #fff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); padding: 20px; max-width: 400px; margin: auto;">
        <div style="font-size: 18px; font-weight: bold; margin-bottom: 10px;">Your credentials to login without using Google service (but you can also login with Google)</div>
        <div style="font-weight: bold;">Email:</div>
        <div style="margin-bottom: 10px;">${email}</div>
        <div style="font-weight: bold;">Password:</div>
        <div style="margin-bottom: 10px;">${password}</div>
  </div>`;
  }
}

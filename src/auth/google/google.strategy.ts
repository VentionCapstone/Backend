import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { config } from 'dotenv';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { PrismaService } from 'src/prisma/prisma.service';

config();

const { GOOGLE_CLIENT_ID, GOOGLE_SECRET, GOOGLE_CALLBACK_URL } = process.env;

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly prismaService: PrismaService) {
    super({
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_SECRET,
      callbackURL: GOOGLE_CALLBACK_URL,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback
  ): Promise<any> {
    const {
      name,
      emails: [{ value: email, verified: isEmailVerified }],
    } = profile;
    const user = {
      email: email,
      firstName: name.givenName,
      lastName: name.familyName,
      isEmailVerified,
      accessToken,
    };

    done(null, user);
  }
}

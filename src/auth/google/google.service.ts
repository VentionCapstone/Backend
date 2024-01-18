import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { MailerService } from 'src/mailer/mailer.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PasswordService } from './password.service';

const { FRONTEND_URL, SALT_LENGTH } = process.env;

const SaltLength = parseInt(SALT_LENGTH!);

@Injectable()
export class GoogleService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly passwordService: PasswordService,
    private readonly mailerService: MailerService
  ) {}
  async googleLogin(user: any): Promise<string> {
    try {
      if (!user) {
        //change
        return 'No user from google';
      }
      const { email, firstName, lastName, isEmailVerified } = user;
      console.log('GoogleService ~ googleLogin ~ req:', user);

      const userFromDb = await this.prismaService.user.findUnique({
        where: { email },
      });

      if (!userFromDb) {
        const password = this.passwordService.generatePassword();
        const hashedPassword: string = await bcrypt.hash(password, SaltLength);

        const savedUser = await this.prismaService.user.create({
          data: {
            email,
            password: hashedPassword,
            firstName,
            lastName,
            isEmailVerified,
          },
        });
        console.log('GoogleService ~ googleLogin ~ savedUser:', savedUser);

        await this.mailerService.sendHtmlEmail(
          email,
          'Your credentials',
          this.generateEmailBody(email, password)
        );
      }

      return `${FRONTEND_URL}/account/create`;
    } catch (err) {
      console.log('GoogleService ~ googleLogin ~ err:', err);

      return `${FRONTEND_URL}/auth/signin`;
    }
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

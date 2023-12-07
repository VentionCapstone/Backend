import * as crypto from 'crypto';
import base64url from 'base64url';
import { Injectable, GoneException, BadRequestException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from 'src/mailer/mailer.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { EmailVerificationDto } from './dto';
import { GlobalException } from 'src/exceptions/global.exception';
import ErrorsTypes from 'src/errors/errors.enum';

@Injectable()
export class VerificationSerivce {
  constructor(
    private readonly mailerService: MailerService,
    private readonly config: ConfigService,
    private readonly prismaService: PrismaService
  ) {}

  async send(email: string): Promise<string> {
    try {
      const hash = crypto.randomBytes(32).toString('hex');
      const expires = Date.now() + this.config.get('EMAIL_EXPIRATION_TIME_MS');
      const token = base64url(`${email}$$${expires}$$${hash}`);

      const url = new URL(this.config.get('MAILER_CALLBACK_URL')!);
      url.searchParams.append('token', token);

      await this.mailerService.sendHtmlEmail(
        email,
        'Verify your email',
        this.generateEmailBody(url.href)
      );

      return token;
    } catch {
      throw new GlobalException(ErrorsTypes.AUTH_FAILED_SEND_VERIFICATION_EMAIL);
    }
  }

  async verify(body: EmailVerificationDto) {
    try {
      const [email, expires, hash] = base64url.decode(body.token).split('$$');
      if (!email || !expires || !hash) throw new BadRequestException('Invalid link');

      const user = await this.prismaService.user.findUnique({
        where: { email: email.toLowerCase() },
      });
      if (!user) throw new NotFoundException('User not found');
      if (user.isEmailVerified) throw new BadRequestException('Email already verified');
      if (user.activationLink !== body.token) throw new BadRequestException('Invalid link');

      const isExpired = +expires < Date.now();
      if (isExpired) throw new GoneException('Link expired');

      await this.prismaService.user.update({
        where: { id: user.id },
        data: { activationLink: null, isEmailVerified: true },
      });

      return {
        success: true,
        message: 'Email verified succesfully',
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException ||
        error instanceof GoneException
      )
        throw error;
      throw new GlobalException(ErrorsTypes.AUTH_FAILED_VERIFY_EMAIL);
    }
  }

  private generateEmailBody(url: string) {
    return `
    <div style="background-color: #f5f5f5; padding: 20px;">
      <div style="background-color: #fff; padding: 20px; border-radius: 5px;text-align: center;">
        <h1>Verify your email</h1>
        <p>Click the link below to verify your email</p>
        <a href="${url}">Verify your email</a>
      </div>
    </div>`;
  }
}

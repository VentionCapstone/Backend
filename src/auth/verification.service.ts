import {
  BadRequestException,
  GoneException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import base64url from 'base64url';
import * as crypto from 'crypto';
import { I18nService } from 'nestjs-i18n';
import ErrorsTypes from 'src/errors/errors.enum';
import { GlobalException } from 'src/exceptions/global.exception';
import { translateMessage } from 'src/helpers/translateMessage.helper';
import { MailerService } from 'src/mailer/mailer.service';
import MessagesTypes from 'src/messages/messages.enum';
import { PrismaService } from 'src/prisma/prisma.service';
import { EmailVerificationDto } from './dto';

@Injectable()
export class VerificationSerivce {
  constructor(
    private readonly mailerService: MailerService,
    private readonly config: ConfigService,
    private readonly prismaService: PrismaService,
    private readonly i18n: I18nService
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
    } catch (error) {
      throw new GlobalException(ErrorsTypes.AUTH_FAILED_SEND_VERIFICATION_EMAIL, error.message);
    }
  }

  async verify(body: EmailVerificationDto) {
    try {
      const [email, expires, hash] = base64url.decode(body.token).split('$$');
      if (!email || !expires || !hash)
        throw new BadRequestException(ErrorsTypes.BAD_REQUEST_AUTH_EMAIL_INVALID_LINK);

      const user = await this.prismaService.user.findUnique({
        where: { email: email.toLowerCase() },
      });
      if (!user) throw new NotFoundException(ErrorsTypes.NOT_FOUND_AUTH_USER);
      if (user.isEmailVerified)
        throw new BadRequestException(ErrorsTypes.BAD_REQUEST_AUTH_EMAIL_ALREADY_VERIFIED);
      if (user.activationLink !== body.token)
        throw new BadRequestException(ErrorsTypes.BAD_REQUEST_AUTH_EMAIL_INVALID_LINK);

      const isExpired = +expires < Date.now();
      if (isExpired) throw new GoneException(ErrorsTypes.BAD_REQUEST_AUTH_EMAIL_EXPIRED_LINK);

      await this.prismaService.user.update({
        where: { id: user.id },
        data: { activationLink: null, isEmailVerified: true },
      });

      return {
        success: true,
        message: translateMessage(this.i18n, MessagesTypes.AUTH_EMAIL_VERIFIED_SUCCESS),
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new GlobalException(ErrorsTypes.AUTH_FAILED_VERIFY_EMAIL, error.message);
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

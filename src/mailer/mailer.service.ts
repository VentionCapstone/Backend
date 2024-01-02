import { MailerService as NestMailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailerService {
  constructor(private mailerService: NestMailerService) {}

  async sendTextEmail(emailTo: string, subject: string, text: string) {
    await this.mailerService.sendMail({
      to: emailTo,
      subject,
      text,
    });
  }

  async sendHtmlEmail(emailTo: string, subject: string, html: string) {
    await this.mailerService.sendMail({
      to: emailTo,
      subject,
      html,
    });
  }
}

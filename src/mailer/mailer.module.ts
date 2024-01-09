import { Module } from '@nestjs/common';
import { MailerModule as NestMailerModule } from '@nestjs-modules/mailer';
import { MailerService } from './mailer.service';

const { MAILER_HOST, MAILER_USER, MAILER_PASS } = process.env;

@Module({
  imports: [
    NestMailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: MAILER_HOST,
          port: 587,
          secure: false,
          auth: {
            user: MAILER_USER,
            pass: MAILER_PASS,
          },
        },
        defaults: {
          from: `Vention Team <${MAILER_USER}>`,
        },
      }),
    }),
  ],
  providers: [MailerService],
  exports: [MailerService],
})
export class MailerModule {}

import { Module } from '@nestjs/common';
import { MailerModule as NestMailerModule } from '@nestjs-modules/mailer';
import { MailerService } from './mailer.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    NestMailerModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.get('MAILER_HOST'),
          port: 587,
          secure: false,
          auth: {
            user: config.get('MAILER_USER'),
            pass: config.get('MAILER_PASS'),
          },
        },
        defaults: {
          from: `Vention Team <${config.get('MAILER_USER')}>`,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MailerService],
  exports: [MailerService],
})
export class MailerModule {}

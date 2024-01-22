import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from 'src/mailer/mailer.module';
import { UserGuard } from '../common/guards/user.guard';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleService } from './google/google.service';
import { PasswordService } from './google/password.service';
import { VerificationSerivce } from './verification.service';

@Module({
  imports: [PrismaModule, JwtModule.register({}), MailerModule],
  controllers: [AuthController],
  providers: [AuthService, UserGuard, VerificationSerivce, GoogleService, PasswordService],
})
export class AuthModule {}

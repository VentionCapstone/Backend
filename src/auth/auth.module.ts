import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { UserGuard } from '../common/guards/user.guard';
import { MailerModule } from 'src/mailer/mailer.module';
import { VerificationSerivce } from './verification.service';

@Module({
  imports: [PrismaModule, JwtModule.register({}), MailerModule],
  controllers: [AuthController],
  providers: [AuthService, UserGuard, VerificationSerivce],
})
export class AuthModule {}

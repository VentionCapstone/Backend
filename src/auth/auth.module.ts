import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from 'src/mailer/mailer.module';
import { UserGuard } from '../common/guards/user.guard';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
// import { GoogleController } from './google/google.controller';
import { GoogleService } from './google/google.service';
// import { GoogleStrategy } from './google/google.strategy';
import { PasswordService } from './google/password.service';
import { VerificationSerivce } from './verification.service';

@Module({
  imports: [PrismaModule, JwtModule.register({}), MailerModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserGuard,
    VerificationSerivce,
    // GoogleStrategy,
    GoogleService,
    PasswordService,
  ],
})
export class AuthModule {}

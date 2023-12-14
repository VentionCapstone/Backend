import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserGuard } from 'src/common/guards/user.guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [JwtModule.register({})],
  controllers: [UserController],
  providers: [UserService, PrismaService, UserGuard],
})
export class UserModule {}

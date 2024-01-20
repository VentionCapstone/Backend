import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserGuard } from 'src/common/guards/user.guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { HostService } from './host.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [JwtModule.register({}), HttpModule],
  controllers: [UserController],
  providers: [UserService, HostService, PrismaService, UserGuard],
})
export class UserModule {}

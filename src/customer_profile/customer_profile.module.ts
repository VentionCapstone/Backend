import { Module } from '@nestjs/common';
import { CustomerProfileService } from './customer_profile.service';
import { CustomerProfileController } from './customer_profile.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { UserGuard } from '../common/guards/user.guard';

@Module({
  imports: [PrismaModule, JwtModule.register({})],
  controllers: [CustomerProfileController],
  providers: [CustomerProfileService, UserGuard],
})
export class CustomerProfileModule {}

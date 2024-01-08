import { Module } from '@nestjs/common';
import { ProfileCustomerService } from './profile_customer.service';
import { ProfileCustomerController } from './profile_customer.controller';

@Module({
  controllers: [ProfileCustomerController],
  providers: [ProfileCustomerService],
})
export class ProfileCustomerModule {}

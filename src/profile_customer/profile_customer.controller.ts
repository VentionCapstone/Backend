import { Controller } from '@nestjs/common';
import { ProfileCustomerService } from './profile_customer.service';

@Controller('profile-customer')
export class ProfileCustomerController {
  constructor(private readonly profileCustomerService: ProfileCustomerService) {}
}

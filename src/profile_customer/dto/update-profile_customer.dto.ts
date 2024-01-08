import { PartialType } from '@nestjs/swagger';
import { CreateProfileCustomerDto } from './create-profile_customer.dto';

export class UpdateProfileCustomerDto extends PartialType(CreateProfileCustomerDto) {}

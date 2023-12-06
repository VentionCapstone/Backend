import CreateAccommodationDto from './create-accommodation.dto';
import CreateAddressDto from './create-address.dto';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export default class CreateAccommodationAndAddressDto {
  @ValidateNested()
  @Type(() => CreateAccommodationDto)
  accommodation: CreateAccommodationDto;

  @ValidateNested()
  @Type(() => CreateAddressDto)
  address: CreateAddressDto;
}

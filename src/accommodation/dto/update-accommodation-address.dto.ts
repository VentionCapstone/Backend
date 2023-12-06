import UpdateAccommodationDto from './update-accommodation.dto';
import UpdateAddressDto from './update-address.dto';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export default class UpdateAccommodationAndAddressDto {
  @ValidateNested()
  @Type(() => UpdateAccommodationDto)
  accommodation: UpdateAccommodationDto;

  @ValidateNested()
  @Type(() => UpdateAddressDto)
  address: UpdateAddressDto;
}

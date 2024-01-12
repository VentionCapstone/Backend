import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { normalizeLocationName } from 'src/helpers/normalizeLocationName.helper';

export default class CreateAddressDto {
  @IsNotEmpty()
  @IsString()
  street: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => normalizeLocationName(value))
  city: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => normalizeLocationName(value))
  country: string;

  @IsNotEmpty()
  @IsString()
  zipCode: string;

  @IsNotEmpty()
  @IsNumber()
  latitude: number;

  @IsNotEmpty()
  @IsNumber()
  longitude: number;
}

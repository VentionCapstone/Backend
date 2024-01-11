import { Transform } from 'class-transformer';
import { IsString, IsNumber, IsNotEmpty } from 'class-validator';
import { normalizeCountryName } from 'src/helpers/normalizeCountryName.helper';

export default class CreateAddressDto {
  @IsNotEmpty()
  @IsString()
  street: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => normalizeCountryName(value))
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

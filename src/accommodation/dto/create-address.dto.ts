import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { normalizeCityName } from 'src/helpers/normalizeCityName.helper';
import { normalizeCountryName } from 'src/helpers/normalizeCountryName.helper';

export default class CreateAddressDto {
  @IsNotEmpty()
  @IsString()
  street: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => normalizeCityName(value))
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

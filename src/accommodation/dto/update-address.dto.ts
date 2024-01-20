import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { normalizeCityName } from 'src/helpers/normalizeCityName.helper';
import { normalizeCountryName } from 'src/helpers/normalizeCountryName.helper';

export default class UpdateAddressDto {
  @IsOptional()
  @IsString()
  street: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => normalizeCityName(value))
  city: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => normalizeCountryName(value))
  country: string;

  @IsOptional()
  @IsString()
  zipCode: string;

  @IsOptional()
  @IsNumber()
  latitude: number;

  @IsOptional()
  @IsNumber()
  longitude: number;
}

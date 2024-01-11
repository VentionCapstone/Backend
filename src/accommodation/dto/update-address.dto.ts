import { Transform } from 'class-transformer';
import { IsString, IsNumber, IsOptional } from 'class-validator';
import { normalizeCountryName } from 'src/helpers/normalizeCountryName.helper';

export default class UpdateAddressDto {
  @IsOptional()
  @IsString()
  street: string;

  @IsOptional()
  @IsString()
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

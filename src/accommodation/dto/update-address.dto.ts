import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { normalizeLocationName } from 'src/helpers/normalizeLocationName.helper';

export default class UpdateAddressDto {
  @IsOptional()
  @IsString()
  street: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => normalizeLocationName(value))
  city: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => normalizeLocationName(value))
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

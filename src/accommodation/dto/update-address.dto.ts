import { IsString, IsInt, IsNumber, IsOptional } from 'class-validator';

export default class UpdateAddressDto {
  @IsOptional()
  @IsString()
  street: string;

  @IsOptional()
  @IsString()
  city: string;

  @IsOptional()
  @IsString()
  country: string;

  @IsOptional()
  @IsInt()
  zipCode: number;

  @IsOptional()
  @IsNumber()
  latitude: number;

  @IsOptional()
  @IsNumber()
  longitude: number;
}

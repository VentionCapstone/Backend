import { Transform } from 'class-transformer';
import { IsDate, IsInt, IsOptional, IsString, IsUrl } from 'class-validator';

export default class UpdateAccommodationDto {
  @IsOptional()
  @IsString()
  @IsUrl()
  thumbnailUrl: string;

  @IsOptional()
  @IsInt()
  squareMeters: number;

  @IsOptional()
  @IsInt()
  numberOfRooms: number;

  @IsOptional()
  @IsInt()
  price: number;

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  availableFrom: Date;

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  availableTo: Date;

  @IsOptional()
  @IsString()
  description: string;
}

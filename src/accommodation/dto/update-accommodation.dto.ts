import { Transform } from 'class-transformer';
import { IsString, IsInt, IsBoolean, IsDate, IsOptional, IsUrl } from 'class-validator';

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
  @IsBoolean()
  availability: boolean;

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

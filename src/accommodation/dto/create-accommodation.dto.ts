import { Transform } from 'class-transformer';
import { IsDate, IsInt, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export default class CreateAccommodationDto {
  @IsOptional()
  @IsString()
  @IsUrl()
  thumbnailUrl: string;

  @IsOptional()
  @IsString()
  previewImgUrl: string;

  @IsNotEmpty()
  @IsInt()
  squareMeters: number;

  @IsNotEmpty()
  @IsInt()
  numberOfRooms: number;

  @IsNotEmpty()
  @IsInt()
  price: number;

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  availableFrom: Date;

  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  availableTo: Date;

  @IsOptional()
  @IsString()
  description: string;
}

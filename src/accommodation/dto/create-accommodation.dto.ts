import { Transform } from 'class-transformer';
import { IsString, IsInt, IsBoolean, IsDate, IsOptional, IsUrl, IsNotEmpty } from 'class-validator';

export default class CreateAccommodationDto {
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

  @IsNotEmpty()
  @IsBoolean()
  availability: boolean;

  @IsNotEmpty()
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

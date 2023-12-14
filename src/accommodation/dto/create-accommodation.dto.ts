import { Transform } from 'class-transformer';
import {
  IsString,
  IsInt,
  IsBoolean,
  IsDate,
  IsOptional,
  IsUrl,
  IsNotEmpty,
  Max,
  Min,
} from 'class-validator';

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
  @Min(0)
  @Max(process.env.ACCOMMODATION_MAX_ROOMS ? +process.env.ACCOMMODATION_MAX_ROOMS : 2147483647)
  numberOfRooms: number;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Max(process.env.ACCOMMODATION_MAX_PEOPLE ? +process.env.ACCOMMODATION_MAX_PEOPLE : 2147483647)
  allowedNumberOfPeople: number;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Max(process.env.ACCOMMODATION_MAX_PRICE ? +process.env.ACCOMMODATION_MAX_PRICE : 2147483647)
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

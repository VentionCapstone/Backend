import { Transform, Type } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import CreateAddressDto from './create-address.dto';

const { ACCOMMODATION_MAX_ROOMS, ACCOMMODATION_MAX_PEOPLE, ACCOMMODATION_MAX_PRICE } = process.env;

export default class CreateAccommodationDto {
  @IsOptional()
  @IsString()
  @IsUrl()
  thumbnailUrl: string;

  @IsOptional()
  @IsString()
  previewImgUrl: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsInt()
  squareMeters: number;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Max(ACCOMMODATION_MAX_ROOMS ? +ACCOMMODATION_MAX_ROOMS : 2147483647)
  numberOfRooms: number;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Max(ACCOMMODATION_MAX_PEOPLE ? +ACCOMMODATION_MAX_PEOPLE : 2147483647)
  allowedNumberOfPeople: number;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Max(ACCOMMODATION_MAX_PRICE ? +ACCOMMODATION_MAX_PRICE : 2147483647)
  price: number;

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  availableFrom: Date;

  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  availableTo: Date;

  @IsNotEmpty()
  @IsInt()
  @Min(-720)
  @Max(720)
  @Transform(({ value }) => value - (value % 15))
  timezoneOffset: number;

  @IsOptional()
  @IsString()
  description: string;

  @ValidateNested()
  @Type(() => CreateAddressDto)
  address: CreateAddressDto;
}

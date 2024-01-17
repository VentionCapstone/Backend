import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import UpdateAddressDto from './update-address.dto';

const { ACCOMMODATION_MAX_ROOMS, ACCOMMODATION_MAX_PEOPLE, ACCOMMODATION_MAX_PRICE } = process.env;
export default class UpdateAccommodationDto {
  @IsOptional()
  @IsString()
  @IsUrl()
  thumbnailUrl: string;

  @IsOptional()
  @IsString()
  previewImgUrl: string;

  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsInt()
  squareMeters: number;

  @IsOptional()
  @IsInt()
  @Max(ACCOMMODATION_MAX_ROOMS ? +ACCOMMODATION_MAX_ROOMS : 2147483647)
  numberOfRooms: number;

  @IsOptional()
  @IsInt()
  @Max(ACCOMMODATION_MAX_PEOPLE ? +ACCOMMODATION_MAX_PEOPLE : 2147483647)
  allowedNumberOfPeople: number;

  @IsOptional()
  @IsInt()
  @Max(ACCOMMODATION_MAX_PRICE ? +ACCOMMODATION_MAX_PRICE : 2147483647)
  price: number;

  @IsOptional()
  @IsBoolean()
  available: boolean;

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  availableFrom: Date;

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  availableTo: Date;

  @IsOptional()
  @IsInt()
  @Min(-720)
  @Max(720)
  @Transform(({ value }) => value - (value % 15))
  timezoneOffset: number;

  @IsOptional()
  @IsString()
  description: string;

  @ValidateNested()
  @Type(() => UpdateAddressDto)
  address: UpdateAddressDto;
}

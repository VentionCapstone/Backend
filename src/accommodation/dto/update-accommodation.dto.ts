import { Transform, Type } from 'class-transformer';
import {
  IsString,
  IsInt,
  IsDate,
  IsOptional,
  IsUrl,
  Max,
  ValidateNested,
  Min,
} from 'class-validator';
import UpdateAddressDto from './update-address.dto';

export default class UpdateAccommodationDto {
  @IsOptional()
  @IsString()
  @IsUrl()
  thumbnailUrl: string;

  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsInt()
  squareMeters: number;

  @IsOptional()
  @IsInt()
  @Max(process.env.ACCOMMODATION_MAX_ROOMS ? +process.env.ACCOMMODATION_MAX_ROOMS : 2147483647)
  numberOfRooms: number;

  @IsOptional()
  @IsInt()
  @Max(process.env.ACCOMMODATION_MAX_PEOPLE ? +process.env.ACCOMMODATION_MAX_PEOPLE : 2147483647)
  allowedNumberOfPeople: number;

  @IsOptional()
  @IsInt()
  @Max(process.env.ACCOMMODATION_MAX_PRICE ? +process.env.ACCOMMODATION_MAX_PRICE : 2147483647)
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

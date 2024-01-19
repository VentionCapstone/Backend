import { Transform } from 'class-transformer';
import { IsDate, IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { SortOrder } from 'src/enums/sortOrder.enum';
import { PaginationDto } from './pagination.dto';
import { ApiProperty } from '@nestjs/swagger';

export enum OrderBy {
  PRICE = 'price',
  NUMBER_OF_ROOMS = 'numberOfRooms',
  NUMBER_OF_PEOPLE = 'allowedNumberOfPeople',
}

const { ACCOMMODATION_MAX_ROOMS, ACCOMMODATION_MAX_PEOPLE, ACCOMMODATION_MAX_PRICE } = process.env;

const parseNumberOrDefault = (value: string | undefined): number => {
  return value ? +value : 2147483647;
};

export class OrderAndFilterDto extends PaginationDto {
  @IsEnum(SortOrder)
  @IsOptional()
  public orderByPrice?: SortOrder;

  @IsEnum(SortOrder)
  @IsOptional()
  public orderByRoom?: SortOrder;

  @IsEnum(SortOrder)
  @IsOptional()
  public orderByPeople?: SortOrder;

  @Transform(({ value }) => +value)
  @IsInt()
  @Min(0)
  @Max(parseNumberOrDefault(ACCOMMODATION_MAX_PRICE))
  @IsOptional()
  minPrice?: number = 0;

  @Transform(({ value }) => +value)
  @IsInt()
  @Min(0)
  @Max(parseNumberOrDefault(ACCOMMODATION_MAX_PRICE))
  @IsOptional()
  maxPrice?: number = parseInt(ACCOMMODATION_MAX_PRICE || '0');

  @Transform(({ value }) => +value)
  @IsInt()
  @Min(0)
  @Max(parseNumberOrDefault(ACCOMMODATION_MAX_ROOMS))
  @IsOptional()
  minRooms?: number = 0;

  @Transform(({ value }) => +value)
  @IsInt()
  @Min(0)
  @Max(parseNumberOrDefault(ACCOMMODATION_MAX_ROOMS))
  @IsOptional()
  maxRooms?: number = parseInt(ACCOMMODATION_MAX_ROOMS || '0');

  @Transform(({ value }) => +value)
  @IsInt()
  @Min(0)
  @Max(parseNumberOrDefault(ACCOMMODATION_MAX_PEOPLE))
  @IsOptional()
  minPeople?: number = 0;

  @Transform(({ value }) => +value)
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(parseNumberOrDefault(ACCOMMODATION_MAX_PEOPLE))
  maxPeople?: number = parseInt(ACCOMMODATION_MAX_PEOPLE || '0');

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'Eastchester, Bronx, United States',
    description: 'street?, city?, country?',
  })
  location?: string;

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  @ApiProperty({ example: '2021-01-01', description: 'YYYY-MM-DD' })
  checkInDate?: Date;

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  @ApiProperty({ example: '2021-01-01', description: 'YYYY-MM-DD' })
  checkOutDate?: Date;
}

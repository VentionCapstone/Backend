import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}
export enum OrderBy {
  PRICE = 'price',
  NUMBER_OF_ROOMS = 'numberOfRooms',
  NUMBER_OF_PEOPLE = 'allowedNumberOfPeople',
}

const parseNumberOrDefault = (value: string | undefined): number => {
  return value ? +value : 2147483647;
};

export class OrderAndFilter {
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
  @IsOptional()
  @IsInt()
  limit?: number = 12;

  @Transform(({ value }) => +value)
  @IsOptional()
  @IsInt()
  page?: number = 1;

  @Transform(({ value }) => +value)
  @IsInt()
  @Min(0)
  @Max(parseNumberOrDefault(process.env.ACCOMMODATION_MAX_PRICE))
  @IsOptional()
  minPrice?: number = 0;

  @Transform(({ value }) => +value)
  @IsInt()
  @Min(0)
  @Max(parseNumberOrDefault(process.env.ACCOMMODATION_MAX_PRICE))
  @IsOptional()
  maxPrice?: number = parseInt(process.env.ACCOMMODATION_MAX_PRICE || '0');

  @Transform(({ value }) => +value)
  @IsInt()
  @Min(0)
  @Max(parseNumberOrDefault(process.env.ACCOMMODATION_MAX_ROOMS))
  @IsOptional()
  minRooms?: number = 0;

  @Transform(({ value }) => +value)
  @IsInt()
  @Min(0)
  @Max(parseNumberOrDefault(process.env.ACCOMMODATION_MAX_ROOMS))
  @IsOptional()
  maxRooms?: number = parseInt(process.env.ACCOMMODATION_MAX_ROOMS || '0');

  @Transform(({ value }) => +value)
  @IsInt()
  @Min(0)
  @Max(parseNumberOrDefault(process.env.ACCOMMODATION_MAX_PEOPLE))
  @IsOptional()
  minPeople?: number = 0;

  @Transform(({ value }) => +value)
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(parseNumberOrDefault(process.env.ACCOMMODATION_MAX_PEOPLE))
  maxPeople?: number = parseInt(process.env.ACCOMMODATION_MAX_PEOPLE || '0');
}
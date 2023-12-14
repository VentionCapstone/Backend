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

export class OrderAndFilter {
  @IsEnum(OrderBy)
  @IsOptional()
  public orderBy?: OrderBy;

  @IsEnum(SortOrder)
  @IsOptional()
  public sortOrder?: SortOrder = SortOrder.DESC;

  @Transform(({ value }) => +value)
  @IsInt()
  @Min(0)
  @Max(Infinity)
  @IsOptional()
  minPrice?: number = 0;

  @Transform(({ value }) => +value)
  @IsInt()
  @Min(0)
  @Max(Number.POSITIVE_INFINITY)
  @IsOptional()
  maxPrice?: number = 1000000000000;

  @Transform(({ value }) => +value)
  @IsInt()
  @Min(0)
  @Max(Number.POSITIVE_INFINITY)
  @IsOptional()
  minRooms?: number = 0;

  @Transform(({ value }) => +value)
  @IsInt()
  @Min(0)
  @Max(Number.POSITIVE_INFINITY)
  @IsOptional()
  maxRooms?: number = Infinity;

  @Transform(({ value }) => +value)
  @IsInt()
  @Min(0)
  @Max(Number.POSITIVE_INFINITY)
  @IsOptional()
  minPeople?: number = 0;

  @Transform(({ value }) => +value)
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(Number.POSITIVE_INFINITY)
  maxPeople?: number = Number.POSITIVE_INFINITY;
}

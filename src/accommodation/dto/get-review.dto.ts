import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional } from 'class-validator';

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}
export enum reviewOrderBy {
  CREATEDAT_DATE = 'createdAt',
  RATE = 'rating',
}

export class OrderAndFilterReview {
  @IsEnum(SortOrder)
  @IsOptional()
  public orderByDate?: SortOrder;

  @IsEnum(SortOrder)
  @IsOptional()
  public orderByRate?: SortOrder;

  @Transform(({ value }) => +value)
  @IsOptional()
  @IsInt()
  limit?: number = 12;

  @Transform(({ value }) => +value)
  @IsOptional()
  @IsInt()
  page?: number = 1;
}

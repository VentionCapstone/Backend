import { IsEnum, IsOptional } from 'class-validator';
import { PaginationDto } from './pagination.dto';

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}
export enum reviewOrderBy {
  CREATEDAT_DATE = 'createdAt',
  RATE = 'rating',
}

export class OrderAndFilterReview extends PaginationDto {
  @IsEnum(SortOrder)
  @IsOptional()
  public orderByDate?: SortOrder;

  @IsEnum(SortOrder)
  @IsOptional()
  public orderByRate?: SortOrder;
}

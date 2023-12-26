import { Transform } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';
import { OrderAndFilterReview } from './get-review.dto';

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}
export enum reviewOrderBy {
  CREATEDAT_DATE = 'createdAt',
  RATE = 'rating',
}

export class GetUserAccommodationsDto extends OrderAndFilterReview {
  @Transform(({ value }) => value === 'true')
  @IsOptional()
  @IsInt()
  includeDeleted?: boolean;
}

import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';
import { PaginationDto } from './pagination.dto';

export class GetUserAccommodationsDto extends PaginationDto {
  @Transform(({ value }) => value === 'true')
  @IsOptional()
  @IsBoolean()
  includeDeleted?: boolean;
}

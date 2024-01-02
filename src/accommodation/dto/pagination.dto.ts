import { Transform } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class PaginationDto {
  @Transform(({ value }) => +value)
  @IsOptional()
  @IsInt()
  limit?: number = 12;

  @Transform(({ value }) => +value)
  @IsOptional()
  @IsInt()
  page?: number = 1;
}

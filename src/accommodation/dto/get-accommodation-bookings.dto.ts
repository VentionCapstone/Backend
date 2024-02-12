import { Transform } from 'class-transformer';
import { IsDate, IsEnum, IsOptional } from 'class-validator';
import { SortOrder } from 'src/enums/sortOrder.enum';

export default class AccommodationBookingsDto {
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  currentMonth?: Date;

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  nextMonth?: Date;

  @IsEnum(SortOrder)
  @IsOptional()
  public orderByStartDate?: SortOrder;
}

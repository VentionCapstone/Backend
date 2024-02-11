import { Transform } from 'class-transformer';
import { IsDate, IsOptional } from 'class-validator';

export default class AccommodationBookingsDto {
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  currentMonth?: Date;

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  nextMonth?: Date;
}

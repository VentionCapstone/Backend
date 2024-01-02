import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class BookingReqDto {
  @IsNotEmpty()
  @IsString()
  accommodationId: string;

  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  @ApiProperty({ example: '2021-01-01', description: 'YYYY-MM-DD' })
  startDate: Date;

  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  @ApiProperty({ example: '2021-01-05', description: 'YYYY-MM-DD' })
  endDate: Date;
}

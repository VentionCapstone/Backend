import { ApiProperty } from '@nestjs/swagger';

export class BookingResDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  startDate: string;

  @ApiProperty()
  endDate: string;

  @ApiProperty({ example: 'PENDING' })
  status: string;
}

import { ApiProperty } from '@nestjs/swagger';

export class BookingResDto {
  id: string;
  startDate: string;
  endDate: string;
  @ApiProperty({ example: 'PENDING' })
  status: string;
}

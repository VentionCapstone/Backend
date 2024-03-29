import { ApiProperty } from '@nestjs/swagger';

export class BookingResDto {
  id: string;
  userId: string;
  accommodationId: string;
  paymentId: string;
  startDate: string;
  endDate: string;
  @ApiProperty({ example: 'PENDING' })
  status: string;
}

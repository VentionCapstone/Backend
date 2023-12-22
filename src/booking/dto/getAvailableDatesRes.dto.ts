import { ApiProperty } from '@nestjs/swagger';

export class AvailableDatesResDto {
  @ApiProperty()
  accommodationId: string;

  @ApiProperty({
    example: [
      ['2023-12-15', '2023-12-16'],
      ['2023-12-18', '2023-12-26'],
    ],
  })
  availableDates: string[] | null;
}

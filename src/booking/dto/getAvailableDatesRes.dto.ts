import { ApiProperty } from '@nestjs/swagger';

export class AvailableDatesResDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ example: ['2023-12-15', '2023-12-16'] })
  availableDates: string[] | null;
}

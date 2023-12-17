import { ApiProperty } from '@nestjs/swagger';

export class DatesNotAvailableResDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ example: false })
  available: boolean;

  @ApiProperty()
  message: string;
}

export class DatesAvailableResDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ example: true })
  available: boolean;

  @ApiProperty({ example: ['2023-12-15', '2023-12-16'] })
  availableDates: string[];
}

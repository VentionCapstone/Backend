import { ApiProperty } from '@nestjs/swagger';
import { AmenitiesDto } from './amenities.dto';

export class AmenitiesResponseDto extends AmenitiesDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  accomodationId: string;
}

export class ResponseDto {
  @ApiProperty()
  message: string;

  @ApiProperty()
  data: AmenitiesResponseDto;
}

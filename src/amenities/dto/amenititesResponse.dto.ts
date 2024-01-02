import { ApiProperty } from '@nestjs/swagger';
import { AmenitiesRequestDto } from './amenitiesRequest.dto';

export class AmenitiesResponseDataDto extends AmenitiesRequestDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  accomodationId: string;
}

export class AmenitiesResponseDto {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  data: AmenitiesResponseDataDto;
}

export class AmenitiesListResponseDto {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  data: Array<string>;
}

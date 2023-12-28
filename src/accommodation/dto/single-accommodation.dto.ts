import { ApiProperty } from '@nestjs/swagger';
import { AmenitiesRequestDto } from 'src/amenities/dto';
import MediaResponseDto from 'src/media/dto/media.dto';
import { AccommodationDto } from './accommodation-response.dto';

export class SingleAccommodationDto extends AccommodationDto {
  @ApiProperty()
  amenities: AmenitiesRequestDto;

  @ApiProperty()
  media: MediaResponseDto[];
}

export default class SingleAccommodationResponseDto {
  @ApiProperty()
  success: boolean;
  @ApiProperty()
  data: SingleAccommodationDto;
}

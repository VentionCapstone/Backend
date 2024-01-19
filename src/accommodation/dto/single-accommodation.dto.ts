import { AmenitiesRequestDto } from 'src/amenities/dto';
import MediaResponseDto from 'src/media/dto/media.dto';
import { AccommodationDto } from './accommodation-response.dto';

export class SingleAccommodationDto extends AccommodationDto {
  amenities: AmenitiesRequestDto;
  media: MediaResponseDto[];
}

export default class SingleAccommodationResponseDto {
  success: boolean;
  data: SingleAccommodationDto;
}

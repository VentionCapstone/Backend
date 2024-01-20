import { AmenitiesRequestDto } from './amenitiesRequest.dto';

export class AmenitiesResponseDataDto extends AmenitiesRequestDto {
  id: string;
  accomodationId: string;
}

export class AmenitiesResponseDto {
  success: boolean;
  data: AmenitiesResponseDataDto;
}

export class AmenitiesListResponseDto {
  success: boolean;
  data: Array<string>;
}

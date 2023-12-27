import { ApiProperty } from '@nestjs/swagger';
import { AmenitiesDto } from 'src/amenities/dto';
import MediaResponseDto from 'src/media/dto/media.dto';
import CreateAddressDto from './create-address.dto';

export class AccommodationDto {
  @ApiProperty()
  thumbnailUrl: string;
  @ApiProperty()
  previewImgUrl: string;
  @ApiProperty()
  squareMeters: number;
  @ApiProperty()
  numberOfRooms: number;
  @ApiProperty()
  allowedNumberOfPeople: number;
  @ApiProperty()
  price: number;
  @ApiProperty()
  availability: boolean;
  @ApiProperty()
  availableFrom: Date;
  @ApiProperty()
  availableTo: Date;
  @ApiProperty()
  description: string;
  @ApiProperty()
  address: CreateAddressDto;
  @ApiProperty()
  amenities: AmenitiesDto;
  @ApiProperty()
  media: MediaResponseDto[];
}

export default class AccommodationResponseDto {
  @ApiProperty()
  success: boolean;
  @ApiProperty()
  data: AccommodationDto;
}

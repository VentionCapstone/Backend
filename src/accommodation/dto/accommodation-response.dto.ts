import { ApiProperty } from '@nestjs/swagger';
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
}

export default class AccommodationResponseDto {
  @ApiProperty()
  success: boolean;
  @ApiProperty()
  data: AccommodationDto;
}

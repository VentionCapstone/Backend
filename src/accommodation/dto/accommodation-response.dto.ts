import CreateAddressDto from './create-address.dto';

export class AccommodationDto {
  thumbnailUrl: string;
  previewImgUrl: string;
  squareMeters: number;
  numberOfRooms: number;
  allowedNumberOfPeople: number;
  price: number;
  availability: boolean;
  availableFrom: Date;
  availableTo: Date;
  description: string;
  address: CreateAddressDto;
}

export default class AccommodationResponseDto {
  success: boolean;
  data: AccommodationDto;
}

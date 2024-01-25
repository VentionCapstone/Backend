export class ListOfAccommodationsDto {
  id: string;
  thumbnailUrl: string;
  previewImgUrl: string;
  squareMeters: number;
  numberOfRooms: number;
  allowedNumberOfPeople: number;
  price: number;
  isInWishlist: boolean;
  address: {
    country: string;
  };
}

export default class ListOfAccommodationsResponseDto {
  success: boolean;
  data: Array<ListOfAccommodationsDto>;
}

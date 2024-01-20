export class ListOfAccommodationsDto {
  id: string;
  thumbnailUrl: string;
  squareMeters: number;
  numberOfRooms: number;
  allowedNumberOfPeople: number;
  price: number;
  address: {
    country: string;
  };
}

export default class ListOfAccommodationsResponseDto {
  success: boolean;
  data: Array<ListOfAccommodationsDto>;
}

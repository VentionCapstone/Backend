class Accommodation {
  id: string;
  thumbnailUrl: string;
  squareMeters: number;
  numberOfRooms: number;
  allowedNumberOfPeople: number;
  price: number;
  address: {
    street: string;
    city: string;
    country: string;
  };
}

class Wishlist {
  id: string;
  createdAt: string;
  accommodation: Accommodation;
}

export class WishlisResponse {
  success: boolean;
  message: string;
}

export class WishlistResponseDto {
  success: boolean;
  data: Wishlist[];
}

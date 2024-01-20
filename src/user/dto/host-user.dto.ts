class HostAccommodationDto {
  id: string;
  title: string;
  previewImgUrl: string;
  rating: number;
}

class HostReviewDto {
  id: string;
  accommodationId: string;
  feedback: string;
  rating: number;
  createdAt: Date;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    profile: {
      imageUrl: string;
    };
  };
}

export class HostUserDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isVerified: boolean;
  isEmailVerified: boolean;
  language: string;
  country: string;
  description: string;
  imageUrl: string;
  joinedAt: Date;
  rating: number;
  accommodations: HostAccommodationDto[];
  reviews: {
    count: number;
    page: number;
    list: HostReviewDto[];
  };
}

export class HostReviewsDto {
  page: number;
  list: HostReviewDto[];
}

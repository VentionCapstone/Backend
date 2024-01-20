type HostAccommodation = {
  id: string;
  title: string;
  previewImgUrl: string;
  rating: number;
};

type HostReview = {
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
};

export type HostUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isVerified: boolean;
  isEmailVerified: boolean;
  createdAt: Date;
  language: string;
  country: string;
  description: string;
  imageUrl: string;
  rating: number;
  reviewsCount: number;
  accommodations: HostAccommodation[];
  reviews: HostReview[];
};

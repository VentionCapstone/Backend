class ProfileDto {
  country: string;
  imageUrl: string;
}
class UserDto {
  id: string;
  firstName: string;
  lastName: string;
  profile: ProfileDto;
}

export class ReviewDto {
  id: string;
  userId: string;
  accommodationId: string;
  feedback: string;
  rating: number;
  createdAt: string;
  user: UserDto;
}

export class ReviewResponseDto {
  success: boolean;
  data: ReviewDto;
}

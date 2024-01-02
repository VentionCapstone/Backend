import { ApiProperty } from '@nestjs/swagger';

class ProfileDto {
  @ApiProperty()
  country: string;

  @ApiProperty()
  imageUrl: string;
}
class UserDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  profile: ProfileDto;
}

export class ReviewDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  accommodationId: string;

  @ApiProperty()
  feedback: string;

  @ApiProperty()
  rating: number;

  @ApiProperty()
  createdAt: string;

  @ApiProperty({ type: UserDto })
  user: UserDto;
}

export class ReviewResponseDto {
  @ApiProperty()
  success: boolean;

  @ApiProperty({ type: ReviewDto })
  data: ReviewDto;
}

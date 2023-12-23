import { ApiProperty } from '@nestjs/swagger';

export default class MediaResponseDto {
  @ApiProperty()
  imageUrl: string;

  @ApiProperty()
  thumbnailUrl: string;

  @ApiProperty()
  accommodationId: string;
}

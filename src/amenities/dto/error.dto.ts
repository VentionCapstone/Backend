import { ApiProperty } from '@nestjs/swagger';

export class ErrorDto {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  error: object;
}

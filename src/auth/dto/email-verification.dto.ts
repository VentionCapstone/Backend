import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class EmailVerificationDto {
  @ApiProperty({ example: 'somelonghash', description: 'limited time token' })
  @IsString()
  token: string;
}

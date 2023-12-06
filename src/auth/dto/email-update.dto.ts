import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail } from 'class-validator';

export class EmailUpdateDto {
  @ApiProperty({ example: 'example@gmail.com', description: 'email' })
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  email: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class LoginDto {
  @ApiProperty({ example: 'example@gmail.com', description: 'email' })
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @ApiProperty({ example: 'Qwerty!2345', description: 'password' })
  password: string;
}

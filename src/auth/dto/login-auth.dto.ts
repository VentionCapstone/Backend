import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsStrongPassword, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'example@gmail.com', description: 'email' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Qwerty!2345', description: 'password' })
  @MinLength(8)
  @IsStrongPassword()
  password: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsStrongPassword, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'example@gmail.com', description: 'email' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Qwerty!2345', description: 'password' })
  @MinLength(8)
  @IsStrongPassword()
  password: string;

  @ApiProperty({ example: 'Qwerty!2345', description: 'confirm_password' })
  @MinLength(8)
  @IsStrongPassword()
  confirm_password: string;
}

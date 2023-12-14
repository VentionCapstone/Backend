import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsStrongPassword, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'example@gmail.com', description: 'email' })
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
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

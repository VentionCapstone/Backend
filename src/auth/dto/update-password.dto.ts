import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsStrongPassword, MinLength } from 'class-validator';

export class PasswordUpdateDto {
  @ApiProperty({ example: 'Qwerty!2345', description: 'old password' })
  @IsNotEmpty()
  @IsString()
  oldPassword: string;

  @ApiProperty({ example: 'Qwerty!2345', description: 'new password' })
  @MinLength(8)
  @IsStrongPassword()
  newPassword: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsStrongPassword, MinLength } from 'class-validator';

export class ForgotPasswordResetDto {
  @ApiProperty({ description: 'token' })
  @IsNotEmpty()
  @IsString()
  token: string;

  @ApiProperty({ example: 'Qwerty!2345', description: 'new password' })
  @MinLength(8)
  @IsStrongPassword()
  newPassword: string;

  @ApiProperty({ example: 'Qwerty!2345', description: 'confirm password' })
  @MinLength(8)
  @IsStrongPassword()
  confirmPassword: string;
}

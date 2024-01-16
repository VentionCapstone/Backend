import { ApiProperty } from '@nestjs/swagger';
import { Gender, UiTheme } from '@prisma/client';
import { IsEnum, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'John', description: 'First Name' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Last Name' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: '359 888 888 888', description: 'Phone Number' })
  @IsString()
  @IsPhoneNumber()
  phoneNumber: string;

  @ApiProperty({ example: 'https://example.com/photo.png', description: 'Photo URL' })
  @IsOptional()
  @IsString()
  imageUrl: string;

  @ApiProperty({ example: 'MALE', description: 'Male' })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({ example: 'Bulgaria', description: 'Country' })
  @IsString()
  country: string;

  @ApiProperty({ example: 'en', description: 'Language' })
  @IsString()
  language: string;

  @ApiProperty({ example: 'dark', description: 'UI Theme' })
  @IsEnum(UiTheme)
  uiTheme: UiTheme;

  @ApiProperty({ example: 'I am a software engineer', description: 'Description' })
  @IsOptional()
  @IsString()
  description: string;
}

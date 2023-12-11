import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Gender, UiTheme } from '@prisma/client';
import { IsEnum, IsString } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ example: 'John', description: 'First Name' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Last Name' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: '+359 888 888 888', description: 'Phone Number' })
  @IsString()
  phoneNumber: string;

  @ApiProperty({ example: 'https://example.com/photo.png', description: 'Photo URL' })
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

  @ApiProperty({ example: 'DARK', description: 'UI Theme' })
  @IsEnum(UiTheme)
  uiTheme: UiTheme;

  @ApiProperty({ example: 'I am a software engineer', description: 'Description' })
  @IsString()
  description: string;

  @ApiProperty({ example: '1', description: 'User ID' })
  @IsString()
  userId: string;
}

import { IsBoolean, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AmenitiesDto {
  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  hasWifi: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  hasParking: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  hasSwimmingPool: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  hasPetAllowance: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isQuiteArea: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  hasBackyard: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  hasSmokingAllowance: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isChildFriendly: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  hasHospitalNearby: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isCloseToCenter: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  hasLaundryService: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  hasKitchen: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  hasAirConditioning: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  hasTv: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  hasAirportTransfer: boolean;

  @ApiProperty()
  @IsString()
  otherAmenities: string;
}

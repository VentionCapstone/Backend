import { IsBoolean, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AmenitiesDto {
  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  wifi: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  parking: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  swimmingPool: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  petAllowance: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  quiteArea: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  backyard: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  smokingAllowance: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  childFriendly: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  hospitalNearby: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  closeToCenter: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  laundryService: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  kitchen: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  airConditioning: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  tv: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  airportTransfer: boolean;

  @ApiProperty()
  @IsString()
  otherAmenities: string;
}

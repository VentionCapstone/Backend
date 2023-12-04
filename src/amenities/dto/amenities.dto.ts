import { IsBoolean, IsString, IsNotEmpty } from 'class-validator';

export class AmenitiesDto {
  @IsBoolean()
  @IsNotEmpty()
  wifi: boolean;

  @IsBoolean()
  @IsNotEmpty()
  parking: boolean;

  @IsBoolean()
  @IsNotEmpty()
  swimmingPool: boolean;

  @IsBoolean()
  @IsNotEmpty()
  petAllowance: boolean;

  @IsBoolean()
  @IsNotEmpty()
  quiteArea: boolean;

  @IsBoolean()
  @IsNotEmpty()
  backyard: boolean;

  @IsBoolean()
  @IsNotEmpty()
  smokingAllowance: boolean;

  @IsBoolean()
  @IsNotEmpty()
  childFriendly: boolean;

  @IsBoolean()
  @IsNotEmpty()
  hospitalNearby: boolean;

  @IsBoolean()
  @IsNotEmpty()
  closeToCenter: boolean;

  @IsBoolean()
  @IsNotEmpty()
  laundryService: boolean;

  @IsBoolean()
  @IsNotEmpty()
  kitchen: boolean;

  @IsBoolean()
  @IsNotEmpty()
  airConditioning: boolean;

  @IsBoolean()
  @IsNotEmpty()
  tv: boolean;

  @IsBoolean()
  @IsNotEmpty()
  airportTransfer: boolean;

  @IsString()
  otherAmenities: string;
}

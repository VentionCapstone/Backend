import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class AmenitiesRequestDto {
  @IsBoolean()
  @IsNotEmpty()
  hasWifi: boolean;

  @IsBoolean()
  @IsNotEmpty()
  hasParking: boolean;

  @IsBoolean()
  @IsNotEmpty()
  hasSwimmingPool: boolean;

  @IsBoolean()
  @IsNotEmpty()
  hasPetAllowance: boolean;

  @IsBoolean()
  @IsNotEmpty()
  isQuiteArea: boolean;

  @IsBoolean()
  @IsNotEmpty()
  hasBackyard: boolean;

  @IsBoolean()
  @IsNotEmpty()
  hasSmokingAllowance: boolean;

  @IsBoolean()
  @IsNotEmpty()
  isChildFriendly: boolean;

  @IsBoolean()
  @IsNotEmpty()
  hasHospitalNearby: boolean;

  @IsBoolean()
  @IsNotEmpty()
  isCloseToCenter: boolean;

  @IsBoolean()
  @IsNotEmpty()
  hasLaundryService: boolean;

  @IsBoolean()
  @IsNotEmpty()
  hasKitchen: boolean;

  @IsBoolean()
  @IsNotEmpty()
  hasAirConditioning: boolean;

  @IsBoolean()
  @IsNotEmpty()
  hasTv: boolean;

  @IsBoolean()
  @IsNotEmpty()
  hasAirportTransfer: boolean;

  @IsString()
  otherAmenities: string;
}

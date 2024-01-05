import { IsNotEmpty, IsString } from 'class-validator';

export class ConfirmPaymentDto {
  @IsNotEmpty()
  @IsString()
  status: string;

  @IsNotEmpty()
  @IsString()
  bookingId: string;
}

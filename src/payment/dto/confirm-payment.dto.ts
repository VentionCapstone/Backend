import { IsNotEmpty, IsString } from 'class-validator';

export class ConfirmPaymentDto {
  @IsNotEmpty()
  @IsString()
  bookingId: string;

  @IsNotEmpty()
  @IsString()
  client_secret: string;
}

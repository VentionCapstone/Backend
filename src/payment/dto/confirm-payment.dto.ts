import { IsNotEmpty, IsString } from 'class-validator';
import { PaymentOption } from './create-payment.dto';

export class ConfirmPaymentDto {
  @IsNotEmpty()
  @IsString()
  paymentOption: PaymentOption;

  @IsNotEmpty()
  @IsString()
  bookingId: string;

  @IsNotEmpty()
  @IsString()
  client_secret: string;
}

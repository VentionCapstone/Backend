import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export enum PaymentOption {
  cash = 'cash',
  card = 'card',
}

export class CreatePaymentDto {
  @IsNotEmpty()
  @IsString()
  paymentOption: PaymentOption;

  @IsNotEmpty()
  @IsNumber()
  totalAmount: number;
}
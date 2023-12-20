import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private readonly stripe: Stripe;

  constructor() {
    const apiVersion = process.env.YOUR_STRIPE_API_VERSION || '2023-10-16';
    this.stripe = new Stripe(`${process.env.YOUR_STRIPE_SECRET_KEY}`, {
      apiVersion,
    } as Stripe.StripeConfig);
  }

  async createPaymentIntent(amount: number): Promise<Stripe.PaymentIntent> {
    return this.stripe.paymentIntents.create({
      amount,
      currency: 'usd',
    });
  }
}

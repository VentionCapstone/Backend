import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { GlobalException } from '../exceptions/global.exception';
import ErrorsTypes from '../errors/errors.enum';

@Injectable()
export class StripeService {
  private readonly stripe: Stripe;

  constructor() {
    const apiVersion = process.env.YOUR_STRIPE_API_VERSION;
    const stripeKey = process.env.YOUR_STRIPE_SECRET_KEY;

    if (!apiVersion && !stripeKey) {
      throw new GlobalException(
        ErrorsTypes.STRIPE_FAILED_TO_PROCESS,
        'Stripe API version or secret key are not set. Please set the environment variables.'
      );
    }

    try {
      this.stripe = new Stripe(String(stripeKey), {
        apiVersion,
      } as Stripe.StripeConfig);
    } catch (error) {
      throw new GlobalException(ErrorsTypes.STRIPE_FAILED_TO_PROCESS, error.message);
    }
  }

  async createPaymentIntent(amount: number): Promise<Stripe.PaymentIntent> {
    return this.stripe.paymentIntents.create({
      amount,
      currency: 'usd',
    });
  }
}

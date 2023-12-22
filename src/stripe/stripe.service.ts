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
        'Stripe API version and secret key are not set. Please set the environment variables.'
      );
    } else if (!apiVersion) {
      throw new GlobalException(
        ErrorsTypes.STRIPE_FAILED_TO_PROCESS,
        'Stripe API version is not set. Please set the YOUR_STRIPE_API_VERSION environment variable.'
      );
    } else if (!stripeKey) {
      throw new GlobalException(
        ErrorsTypes.STRIPE_FAILED_TO_PROCESS,
        'Stripe secret key is not set. Please set the YOUR_STRIPE_SECRET_KEY environment variable.'
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

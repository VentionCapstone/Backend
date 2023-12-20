import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StripeService } from '../stripe/stripe.service';
import { Status } from '@prisma/client';

@Injectable()
export class PaymentService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly stripeService: StripeService
  ) {}

  async processPayment(userId: string, totalAmount: number, paymentOption: string) {
    const bookingDetails = await this.prismaService.booking.findMany({
      where: { userId, status: 'PENDING' },
    });

    const paymentIntent = await this.stripeService.createPaymentIntent(
      Math.round(totalAmount * 100)
    );

    await this.prismaService.payment.create({
      data: {
        type: paymentOption,
        transactionId: paymentIntent.id,
        totalAmount,
        status: Status.PENDING,
        booking: { connect: bookingDetails.map((booking) => ({ id: booking.id })) },
      },
    });
  }

  async processCashPayment(userId: string, totalAmount: number, paymentOption: string) {
    const bookingDetails = await this.prismaService.booking.findMany({
      where: { userId, status: 'PENDING' },
    });

    await this.prismaService.payment.create({
      data: {
        type: paymentOption,
        totalAmount,
        status: Status.COMPLETED,
        booking: { connect: bookingDetails.map((booking) => ({ id: booking.id })) },
      },
    });
  }
}

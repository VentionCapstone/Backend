import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StripeService } from '../stripe/stripe.service';
import { Status } from '@prisma/client';
import { GlobalException } from '../exceptions/global.exception';
import ErrorsTypes from '../errors/errors.enum';

@Injectable()
export class PaymentService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly stripeService: StripeService
  ) {}

  async processPayment(userId: string, totalAmount: number, paymentOption: string) {
    try {
      const bookingDetails = await this.prismaService.booking.findMany({
        where: { userId, status: Status.PENDING },
      });
      if (bookingDetails.length) {
        throw new BadRequestException('Booking details not found');
      }
      const paymentIntent = await this.stripeService.createPaymentIntent(
        Math.round(totalAmount * 100)
      );

      await this.prismaService.payment.create({
        data: {
          type: paymentOption,
          transactionId: paymentIntent.id,
          totalAmount,
          status: Status.COMPLETED,
          booking: { connect: bookingDetails.map((booking) => ({ id: booking.id })) },
        },
      });

      await this.prismaService.booking.updateMany({
        where: { userId, status: Status.PENDING },
        data: { status: Status.COMPLETED },
      });
    } catch (error) {
      throw new GlobalException(ErrorsTypes.PAYMENT_FAILED_TO_PROCESS, error.message);
    }
  }

  async processCashPayment(userId: string, totalAmount: number, paymentOption: string) {
    try {
      const bookingDetails = await this.prismaService.booking.findMany({
        where: { userId, status: Status.PENDING },
      });
      if (bookingDetails.length) {
        throw new BadRequestException('Booking details not found');
      }
      await this.prismaService.payment.create({
        data: {
          type: paymentOption,
          totalAmount,
          status: Status.COMPLETED,
          booking: { connect: bookingDetails.map((booking) => ({ id: booking.id })) },
        },
      });

      await this.prismaService.booking.updateMany({
        where: { userId, status: Status.PENDING },
        data: { status: Status.COMPLETED },
      });
    } catch (error) {
      throw new GlobalException(ErrorsTypes.PAYMENT_FAILED_TO_PROCESS, error.message);
    }
  }
}

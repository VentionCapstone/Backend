import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Status } from '@prisma/client';
import ErrorsTypes from '../errors/errors.enum';
import { GlobalException } from '../exceptions/global.exception';
import { PrismaService } from '../prisma/prisma.service';
import { StripeService } from '../stripe/stripe.service';

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

      if (bookingDetails.length === 0) {
        throw new NotFoundException(ErrorsTypes.NOT_FOUND_BOOKING);
      }

      const paymentIntent = await this.stripeService.createPaymentIntent(
        Math.round(totalAmount * 100)
      );

      if (paymentIntent.status === 'succeeded') {
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

        return { success: true, message: 'Payment processed successfully' };
      } else {
        throw new BadRequestException(ErrorsTypes.BAD_REQUEST_PAYMENT_FAILED);
      }
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
        throw new NotFoundException(ErrorsTypes.NOT_FOUND_BOOKING);
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

      return { success: true, message: 'Payment processed successfully' };
    } catch (error) {
      throw new GlobalException(ErrorsTypes.PAYMENT_FAILED_TO_PROCESS, error.message);
    }
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { Status } from '@prisma/client';
import { I18nService } from 'nestjs-i18n';
import { translateMessage } from 'src/helpers/translateMessage.helper';
import MessagesTypes from 'src/messages/messages.enum';
import ErrorsTypes from '../errors/errors.enum';
import { GlobalException } from '../exceptions/global.exception';
import { PrismaService } from '../prisma/prisma.service';
import { StripeService } from '../stripe/stripe.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import dayjs from 'dayjs';

@Injectable()
export class PaymentService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly stripeService: StripeService,
    private readonly i18n: I18nService
  ) {}

  async processPayment(createPaymentDto: CreatePaymentDto) {
    try {
      const totalAmount = await this.getTotalAmount(createPaymentDto.bookingId);
      const paymentIntent = await this.stripeService.createPaymentIntent(
        Math.round(totalAmount * 100)
      );
      return paymentIntent.client_secret;
    } catch (error) {
      throw new GlobalException(ErrorsTypes.PAYMENT_FAILED_TO_PROCESS, error.message);
    }
  }

  async processCashPayment(createPaymentDto: CreatePaymentDto) {
    try {
      const totalAmount = await this.getTotalAmount(createPaymentDto.bookingId);
      await this.prismaService.payment.create({
        data: {
          type: createPaymentDto.paymentOption,
          totalAmount,
          status: Status.COMPLETED,
        },
      });

      await this.prismaService.booking.updateMany({
        where: { id: createPaymentDto.bookingId, status: Status.PENDING },
        data: { status: Status.COMPLETED },
      });

      return {
        success: true,
        message: await translateMessage(this.i18n, MessagesTypes.BOOKING_PAYMENT_SUCCESS),
      };
    } catch (error) {
      throw new GlobalException(ErrorsTypes.PAYMENT_FAILED_TO_PROCESS, error.message);
    }
  }

  async getTotalAmount(bookingId: string) {
    const bookingDetails = await this.prismaService.booking.findFirst({
      where: { id: bookingId, status: Status.PENDING },
    });
    if (bookingDetails == null) {
      throw new NotFoundException(ErrorsTypes.NOT_FOUND_BOOKING);
    }

    const accommodationDetails = await this.prismaService.accommodation.findFirst({
      where: { id: bookingDetails.accommodationId },
    });
    if (accommodationDetails == null) {
      throw new NotFoundException(ErrorsTypes.NOT_FOUND_ACCOMMODATION);
    }
    const amountOfDays = dayjs(bookingDetails.endDate).diff(dayjs(bookingDetails.startDate), 'day');
    return accommodationDetails.price * amountOfDays;
  }
}

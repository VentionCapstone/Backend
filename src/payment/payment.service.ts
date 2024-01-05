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
import * as dayjs from 'dayjs';
import { ConfirmPaymentDto } from './dto/confirm-payment.dto';

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
      const payment = await this.prismaService.payment.create({
        data: {
          type: createPaymentDto.paymentOption,
          totalAmount,
          status: Status.PENDING,
        },
      });
      await this.prismaService.booking.update({
        data: { paymentId: payment.id },
        where: { id: createPaymentDto.bookingId },
      });
      return paymentIntent.client_secret;
    } catch (error) {
      throw new GlobalException(ErrorsTypes.PAYMENT_FAILED_TO_PROCESS, error.message);
    }
  }

  async confirmPayment(confirmPaymentDto: ConfirmPaymentDto) {
    const handlers: {
      [key: string]: () => Promise<{ success: boolean; message: string }>;
    } = {
      succeeded: async () => {
        await this.prismaService.booking.update({
          data: { status: Status.COMPLETED },
          where: { id: confirmPaymentDto.bookingId },
        });
        const paymentId = await this.getPaymentId(confirmPaymentDto.bookingId);
        await this.prismaService.payment.update({
          data: { status: Status.COMPLETED },
          where: { id: paymentId },
        });
        return this.setMessage(
          true,
          await translateMessage(this.i18n, MessagesTypes.BOOKING_PAYMENT_SUCCESS)
        );
      },
      processing: async () => {
        return this.setMessage(
          true,
          await translateMessage(this.i18n, MessagesTypes.BOOKING_PAYMENT_PROCESSING)
        );
      },
      requires_payment_method: async () => {
        return this.setMessage(
          false,
          await translateMessage(this.i18n, MessagesTypes.BOOKING_PAYMENT_REQUEIRED_METHOD)
        );
      },
      default: async () => {
        return this.setMessage(
          false,
          await translateMessage(this.i18n, MessagesTypes.BOOKING_PAYMENT_FAILED)
        );
      },
    };
    const status = confirmPaymentDto.status;
    const handler = handlers[status] || handlers.default;
    return handler();
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
    if (!bookingDetails) {
      throw new NotFoundException(ErrorsTypes.NOT_FOUND_BOOKING);
    }

    const { accommodationId, startDate, endDate } = bookingDetails;

    const accommodationDetails = await this.prismaService.accommodation.findFirst({
      where: { id: accommodationId },
    });
    if (!accommodationDetails) {
      throw new NotFoundException(ErrorsTypes.NOT_FOUND_ACCOMMODATION);
    }
    const startDay = dayjs(startDate);
    const endDay = dayjs(endDate);
    const amountOfDays = endDay.diff(startDay, 'day');
    return accommodationDetails.price * amountOfDays;
  }

  async setMessage(success: boolean, message: string) {
    return { success, message };
  }

  async getPaymentId(bookingId: string) {
    const bookingDetails = await this.prismaService.booking.findUnique({
      where: { id: bookingId },
    });
    if (!bookingDetails) {
      throw new NotFoundException(ErrorsTypes.NOT_FOUND_BOOKING);
    }
    const paymentDetails = await this.prismaService.payment.findFirst({
      where: { id: bookingDetails.paymentId },
    });
    if (!paymentDetails) {
      throw new NotFoundException(ErrorsTypes.NOT_FOUND_PAYMENT);
    }
    return paymentDetails.id;
  }
}

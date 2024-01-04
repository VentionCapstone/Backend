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

  async confirmPaymentProcess(confirmPaymentDto: ConfirmPaymentDto) {
    const bookingDetails = await this.prismaService.booking.findFirst({
      where: { id: confirmPaymentDto.bookingId },
    });

    if (bookingDetails == null) {
      throw new NotFoundException(ErrorsTypes.NOT_FOUND_BOOKING);
    }

    if (bookingDetails.paymentId === null) {
      throw new NotFoundException(ErrorsTypes.NOT_FOUND_PAYMENT);
    }

    try {
      const confirmedPayment = await this.stripeService.confirmPayment(
        confirmPaymentDto.client_secret
      );

      if (confirmedPayment.status === 'succeeded') {
        await this.prismaService.payment.update({
          data: { status: Status.COMPLETED },
          where: { id: bookingDetails.paymentId },
        });
        await this.prismaService.booking.update({
          data: { status: Status.COMPLETED },
          where: { id: confirmPaymentDto.bookingId },
        });

        return {
          success: true,
          message: await translateMessage(this.i18n, MessagesTypes.BOOKING_PAYMENT_SUCCESS),
        };
      }
      return {
        success: false,
        message: await translateMessage(this.i18n, MessagesTypes.BOOKING_PAYMENT_FAILED),
      };
    } catch (error) {
      throw new GlobalException(ErrorsTypes.PAYMNET_FAILED_WHILE_CONFIRM, error.message);
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

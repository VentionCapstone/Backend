import { BadRequestException, Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserGuard } from '../common/guards/user.guard';
import ErrorsTypes from '../errors/errors.enum';
import { GlobalException } from '../exceptions/global.exception';
import { CreatePaymentDto, PaymentOption } from './dto/create-payment.dto';
import { PaymentService } from './payment.service';

type PaymentHandler = (
  createPaymentDto: CreatePaymentDto
) => Promise<{ success: boolean; message: string } | string | null>;

@Controller('payment')
@UseGuards(UserGuard)
@ApiTags('payment')
@ApiBearerAuth()
export class PaymentController {
  private paymentHandlers: Record<string, PaymentHandler>;

  constructor(private readonly paymentService: PaymentService) {
    this.paymentHandlers = {
      cash: async (createPaymentDto) =>
        this.paymentService.processCashPayment({
          bookingId: createPaymentDto.bookingId,
          paymentOption: createPaymentDto.paymentOption || PaymentOption.cash,
        }),
      card: async (createPaymentDto) =>
        this.paymentService.processPayment({
          bookingId: createPaymentDto.bookingId,
          paymentOption: createPaymentDto.paymentOption || PaymentOption.card,
        }),
    };
  }

  @Post('')
  @ApiOperation({ summary: 'Handle payment' })
  @ApiResponse({ status: 200, description: 'Payment processed successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async handlePayment(@Body() createPaymentDto: CreatePaymentDto) {
    if (!this.paymentHandlers[createPaymentDto.paymentOption]) {
      throw new BadRequestException(ErrorsTypes.BAD_REQUEST_INVALID_PAYMENT_OPTION);
    }

    try {
      const paymentResult =
        await this.paymentHandlers[createPaymentDto.paymentOption](createPaymentDto);
      return paymentResult;
    } catch (error) {
      throw new GlobalException(ErrorsTypes.PAYMENT_FAILED_TO_PROCESS, error.message);
    }
  }
}

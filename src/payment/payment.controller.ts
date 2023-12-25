import { Controller, Post, Body, UseGuards, BadRequestException } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto, PaymentOption } from './dto/create-payment.dto';
import { UserGuard } from '../common/guards/user.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { GlobalException } from '../exceptions/global.exception';
import ErrorsTypes from '../errors/errors.enum';
import { I18nService } from 'nestjs-i18n';

type PaymentHandler = (
  userId: string,
  totalAmount: number,
  paymentOption?: string
) => Promise<{ success: boolean; message: string }>;

@Controller('payment')
@UseGuards(UserGuard)
@ApiTags('payment')
@ApiBearerAuth()
export class PaymentController {
  private paymentHandlers: Record<string, PaymentHandler>;
  private readonly i18n: I18nService;

  constructor(private readonly paymentService: PaymentService) {
    this.paymentHandlers = {
      cash: async (userId, totalAmount, paymentOption) =>
        this.paymentService.processCashPayment(
          userId,
          totalAmount,
          paymentOption || PaymentOption.cash
        ),
      card: async (userId, totalAmount, paymentOption) =>
        this.paymentService.processPayment(
          userId,
          totalAmount,
          paymentOption || PaymentOption.card
        ),
    };
  }

  @Post('')
  @ApiOperation({ summary: 'Handle payment' })
  @ApiResponse({ status: 200, description: 'Payment processed successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async handlePayment(
    @Body() createPaymentDto: CreatePaymentDto,
    @CurrentUser('id') userId: string
  ): Promise<{ success: boolean; message: string }> {
    const { totalAmount, paymentOption } = createPaymentDto;

    if (!this.paymentHandlers[paymentOption]) {
      throw new BadRequestException(this.i18n, 'errors.INVALID_PAYMENT_OPTION');
    }

    try {
      const paymentResult = await this.paymentHandlers[paymentOption](
        userId,
        totalAmount,
        paymentOption
      );

      return paymentResult;
    } catch (error) {
      throw new GlobalException(ErrorsTypes.PAYMENT_FAILED_TO_PROCESS, error.message);
    }
  }
}

import { Controller, Post, Body, Req, UseGuards, BadRequestException } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto, PaymentOption } from './dto/create-payment.dto';
import { UserGuard } from '../common/guards/user.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

type PaymentHandler = (
  userId: string,
  totalAmount: number,
  paymentOption?: string
) => Promise<void>;

@Controller('payment')
@UseGuards(UserGuard)
@ApiTags('payment')
@ApiBearerAuth()
export class PaymentController {
  private paymentHandlers: Record<string, PaymentHandler>;

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

  @ApiOperation({ summary: 'Handle payment' })
  @ApiResponse({ status: 200, description: 'Payment processed successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Post('')
  async handlePayment(@Body() createPaymentDto: CreatePaymentDto, @Req() req: any) {
    const { totalAmount, paymentOption } = createPaymentDto;

    if (!this.paymentHandlers[paymentOption]) {
      throw new BadRequestException('Invalid payment option');
    }
    await this.paymentHandlers[paymentOption](req.user.id, totalAmount, paymentOption);
  }
}

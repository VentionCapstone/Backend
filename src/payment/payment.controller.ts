import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UserGuard } from '../common/guards/user.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('payment')
@UseGuards(UserGuard)
@ApiTags('payment')
@ApiBearerAuth()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @ApiOperation({ summary: 'Handle payment' })
  @ApiResponse({ status: 200, description: 'Payment processed successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Post('')
  async handlePayment(@Body() createPaymentDto: CreatePaymentDto, @Req() req: any) {
    const { totalAmount, paymentOption } = createPaymentDto;

    if (paymentOption === 'cash') {
      await this.paymentService.processCashPayment(req.user.id, totalAmount);
    } else {
      await this.paymentService.processPayment(req.user.id, totalAmount, paymentOption);
    }
  }
}

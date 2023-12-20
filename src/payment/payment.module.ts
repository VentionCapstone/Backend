import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { StripeModule } from '../stripe/stripe.module';

@Module({
  imports: [PrismaModule, JwtModule.register({}), StripeModule],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}

import { Module } from '@nestjs/common';
import { RazorpayService } from './razorpay.service';
import { RazorpayController } from './razorpay.controller';
import { PaymentsService } from 'src/order/payments/payments.service';
import { PaymentsModule } from 'src/order/payments/payments.module';

@Module({
  providers: [RazorpayService],
  controllers: [RazorpayController],
  imports: [
    PaymentsModule, // <-- This brings PaymentsService (and its dependencies) into RazorpayModule's context
  ],
    exports: [RazorpayService], // <-- IMPORTANT: Export RazorpayService for other modules to use

})
export class RazorpayModule {}

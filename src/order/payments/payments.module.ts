import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { RazorpayService } from 'src/razorpay/razorpay.service';
import { PaymentsService } from './payments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Order } from '../orders/entities/order.entity';
import { WalletModule } from 'src/customer/wallet/wallet.module';
import { Wallet } from 'src/customer/wallet/entities/wallet.entity';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService],
  imports:[TypeOrmModule.forFeature([Payment,Order,Wallet]),WalletModule],
    exports: [PaymentsService], // <-- IMPORTANT: PaymentsService must be exported

  
})
export class PaymentsModule {}

import { Module } from '@nestjs/common';
import { PdfGenerationService } from './pdf-generation.service';
import { PdfGenerationController } from './pdf-generation.controller';
import { OrdersModule } from 'src/order/orders/orders.module';
import { EodClosureModule } from 'src/eod-closure/eod-closure.module';

@Module({
  controllers: [PdfGenerationController],
  providers: [PdfGenerationService],
  imports:[OrdersModule,EodClosureModule]
})
export class PdfGenerationModule {}

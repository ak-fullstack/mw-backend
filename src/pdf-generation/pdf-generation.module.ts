import { Module } from '@nestjs/common';
import { PdfGenerationService } from './pdf-generation.service';
import { PdfGenerationController } from './pdf-generation.controller';
import { OrdersModule } from 'src/order/orders/orders.module';
import { EodClosureModule } from 'src/eod-closure/eod-closure.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EodClosure } from 'src/eod-closure/entities/eod-closure.entity';

@Module({
  controllers: [PdfGenerationController],
  providers: [PdfGenerationService],
  imports:[OrdersModule,EodClosureModule,TypeOrmModule.forFeature([EodClosure])]
})
export class PdfGenerationModule {}

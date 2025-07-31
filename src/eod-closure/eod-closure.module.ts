import { Module } from '@nestjs/common';
import { EodClosureService } from './eod-closure.service';
import { EodClosureController } from './eod-closure.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EodClosure } from './entities/eod-closure.entity';
import { OrderModule } from 'src/order/order.module';
import { OrdersModule } from 'src/order/orders/orders.module';
import { Order } from 'src/order/orders/entities/order.entity';
import { Return } from 'src/order/returns/entities/return.entity';

@Module({
  controllers: [EodClosureController],
  providers: [EodClosureService],
  imports:[TypeOrmModule.forFeature([EodClosure,Order,Return])],
  exports:[EodClosureService]
})
export class EodClosureModule {}

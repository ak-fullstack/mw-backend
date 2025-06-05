import { Module } from '@nestjs/common';
import { RefundsService } from './refunds.service';
import { RefundsController } from './refunds.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Refund } from './entities/refund.entity';

@Module({
  controllers: [RefundsController],
  providers: [RefundsService],
  imports: [TypeOrmModule.forFeature([Refund])]

})
export class RefundsModule { }

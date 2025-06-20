import { Module } from '@nestjs/common';
import { ReturnItemsService } from './return-items.service';
import { ReturnItemsController } from './return-items.controller';

@Module({
  controllers: [ReturnItemsController],
  providers: [ReturnItemsService],
})
export class ReturnItemsModule {}

import { Module } from '@nestjs/common';
import { ShiprocketShipmentsService } from './shiprocket-shipments.service';
import { ShiprocketShipmentsController } from './shiprocket-shipments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShiprocketShipment } from './entities/shiprocket-shipment.entity';
import { RedisModule } from 'src/redis/redis.module';
import { ShiprocketStatusLogModule } from '../shiprocket-status-log/shiprocket-status-log.module';

@Module({
  controllers: [ShiprocketShipmentsController],
  providers: [ShiprocketShipmentsService],
  imports:[TypeOrmModule.forFeature([ShiprocketShipment]),RedisModule,ShiprocketStatusLogModule],
  exports: [ShiprocketShipmentsService],
})
export class ShiprocketShipmentsModule {}

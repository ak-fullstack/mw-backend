import { Module } from '@nestjs/common';
import { OrderSettingsService } from './order-settings.service';
import { OrderSettingsController } from './order-settings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderSetting } from './entities/order-setting.entity';

@Module({
  controllers: [OrderSettingsController],
  providers: [OrderSettingsService],
  imports:[TypeOrmModule.forFeature([OrderSetting])],
  exports:[OrderSettingsService]
})
export class OrderSettingsModule {}

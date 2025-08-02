import { Injectable } from '@nestjs/common';
import { CreateOrderSettingDto } from './dto/create-order-setting.dto';
import { UpdateOrderSettingDto } from './dto/update-order-setting.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderSetting } from './entities/order-setting.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrderSettingsService {

   constructor(
    @InjectRepository(OrderSetting)
    private readonly orderSettingRepo: Repository<OrderSetting>,
  ) {}
  
  async getSettings(): Promise<Record<string, any>> {
  const setting = await this.orderSettingRepo.findOne({
    where: {},
  });

  return setting?.settings || {};
}
}

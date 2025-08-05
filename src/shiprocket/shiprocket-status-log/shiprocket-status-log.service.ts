import { Injectable } from '@nestjs/common';
import { CreateShiprocketStatusLogDto } from './dto/create-shiprocket-status-log.dto';
import { UpdateShiprocketStatusLogDto } from './dto/update-shiprocket-status-log.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ShiprocketStatusLog } from './entities/shiprocket-status-log.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ShiprocketStatusLogService {

  constructor(
    @InjectRepository(ShiprocketStatusLog)
    private readonly shiprocketStatusLogRepository: Repository<ShiprocketStatusLog>,
  ) { }

  async createShipmentLog(shipment: any,manager): Promise<any> {
    console.log(shipment);
    
    await manager.getRepository(ShiprocketStatusLog).save({
      shipment: { id: shipment.id },
      status: shipment.shipmentStatus, // Should be "NEW"
      description: shipment.description || null, // Optional description
    });
  }
}

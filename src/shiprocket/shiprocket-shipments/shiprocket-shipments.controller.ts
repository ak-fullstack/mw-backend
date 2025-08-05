import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ShiprocketShipmentsService } from './shiprocket-shipments.service';
import { CreateShiprocketShipmentDto } from './dto/create-shiprocket-shipment.dto';
import { UpdateShiprocketShipmentDto } from './dto/update-shiprocket-shipment.dto';

@Controller('shiprocket-shipments')
export class ShiprocketShipmentsController {
  constructor(private readonly shiprocketShipmentsService: ShiprocketShipmentsService) {}

}

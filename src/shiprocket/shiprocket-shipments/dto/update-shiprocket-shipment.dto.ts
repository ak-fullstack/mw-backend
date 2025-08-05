import { PartialType } from '@nestjs/mapped-types';
import { CreateShiprocketShipmentDto } from './create-shiprocket-shipment.dto';

export class UpdateShiprocketShipmentDto extends PartialType(CreateShiprocketShipmentDto) {}

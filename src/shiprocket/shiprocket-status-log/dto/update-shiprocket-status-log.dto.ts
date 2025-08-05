import { PartialType } from '@nestjs/mapped-types';
import { CreateShiprocketStatusLogDto } from './create-shiprocket-status-log.dto';

export class UpdateShiprocketStatusLogDto extends PartialType(CreateShiprocketStatusLogDto) {}

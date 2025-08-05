import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ShiprocketStatusLogService } from './shiprocket-status-log.service';
import { CreateShiprocketStatusLogDto } from './dto/create-shiprocket-status-log.dto';
import { UpdateShiprocketStatusLogDto } from './dto/update-shiprocket-status-log.dto';

@Controller('shiprocket-status-log')
export class ShiprocketStatusLogController {
  constructor(private readonly shiprocketStatusLogService: ShiprocketStatusLogService) {}

 
}

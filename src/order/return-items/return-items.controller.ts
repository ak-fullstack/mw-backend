import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReturnItemsService } from './return-items.service';
import { CreateReturnItemDto } from './dto/create-return-item.dto';
import { UpdateReturnItemDto } from './dto/update-return-item.dto';

@Controller('return-items')
export class ReturnItemsController {
  constructor(private readonly returnItemsService: ReturnItemsService) {}

}

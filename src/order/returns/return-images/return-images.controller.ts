import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReturnImagesService } from './return-images.service';
import { CreateReturnImageDto } from './dto/create-return-image.dto';
import { UpdateReturnImageDto } from './dto/update-return-image.dto';

@Controller('return-images')
export class ReturnImagesController {
  constructor(private readonly returnImagesService: ReturnImagesService) {}


}

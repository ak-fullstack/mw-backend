import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReturnImagesService } from './return-images.service';
import { CreateReturnImageDto } from './dto/create-return-image.dto';
import { UpdateReturnImageDto } from './dto/update-return-image.dto';

@Controller('return-images')
export class ReturnImagesController {
  constructor(private readonly returnImagesService: ReturnImagesService) {}

  @Post()
  create(@Body() createReturnImageDto: CreateReturnImageDto) {
    return this.returnImagesService.create(createReturnImageDto);
  }

  @Get()
  findAll() {
    return this.returnImagesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.returnImagesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReturnImageDto: UpdateReturnImageDto) {
    return this.returnImagesService.update(+id, updateReturnImageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.returnImagesService.remove(+id);
  }
}

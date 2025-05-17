import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SizeTypesService } from './size-types.service';
import { CreateSizeTypeDto } from './dto/create-size-type.dto';
import { UpdateSizeTypeDto } from './dto/update-size-type.dto';

@Controller('size-types')
export class SizeTypesController {
  constructor(private readonly sizeTypesService: SizeTypesService) {}

  @Post()
  create(@Body() createSizeTypeDto: CreateSizeTypeDto) {
    return this.sizeTypesService.create(createSizeTypeDto);
  }

  @Get()
  findAll() {
    return this.sizeTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sizeTypesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSizeTypeDto: UpdateSizeTypeDto) {
    return this.sizeTypesService.update(+id, updateSizeTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sizeTypesService.remove(+id);
  }
}

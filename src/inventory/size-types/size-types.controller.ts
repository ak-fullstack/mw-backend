import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SizeTypesService } from './size-types.service';
import { CreateSizeTypeDto } from './dto/create-size-type.dto';
import { UpdateSizeTypeDto } from './dto/update-size-type.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RequirePermissions } from 'src/decorators/permission.decorator';
import { PermissionEnum } from 'src/enum/permissions.enum';
import { PermissionsGuard } from 'src/guards/permissions.guard';

@Controller('size-types')
export class SizeTypesController {
  constructor(private readonly sizeTypesService: SizeTypesService) { }

  @Post()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions(PermissionEnum.CREATE_PRODUCT)
  create(@Body() createSizeTypeDto: CreateSizeTypeDto) {
    return this.sizeTypesService.create(createSizeTypeDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions(PermissionEnum.READ_PRODUCT)
  findAll() {
    return this.sizeTypesService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions(PermissionEnum.READ_PRODUCT)
  findOne(@Param('id') id: string) {
    return this.sizeTypesService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions(PermissionEnum.UPDATE_PRODUCT)
  update(@Param('id') id: string, @Body() updateSizeTypeDto: UpdateSizeTypeDto) {
    return this.sizeTypesService.update(+id, updateSizeTypeDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions(PermissionEnum.DELETE_PRODUCT)
  remove(@Param('id') id: string) {
    return this.sizeTypesService.remove(+id);
  }
}

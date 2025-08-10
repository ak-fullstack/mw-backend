import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { OrderSettingsService } from './order-settings.service';
import { Roles } from 'src/decorators/roles.decorator';
import { RoleEnum } from 'src/enum/roles.enum';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { RequirePermissions } from 'src/decorators/permission.decorator';
import { PermissionEnum } from 'src/enum/permissions.enum';
import { PermissionsGuard } from 'src/guards/permissions.guard';

@Controller('order-settings')
export class OrderSettingsController {
  constructor(private readonly orderSettingsService: OrderSettingsService) { }



  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions(PermissionEnum.READ_SETTINGS)
  async getSettings() {
    return await this.orderSettingsService.getSettings();
  }
}

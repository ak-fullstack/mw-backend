import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RequirePermissions } from 'src/decorators/permission.decorator';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/guards/permissions.guard';
import { PermissionEnum } from 'src/enum/permissions.enum';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('add-new-user')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions(PermissionEnum.CREATE_USER)
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('get-all-users')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions(PermissionEnum.READ_USER)
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get('user-statuses')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions(PermissionEnum.READ_USER)
  getUserStatuses(): any {
    return this.userService.getAllUserStatuses();
  }

  @Patch('update-user/:id') // Accept the ID as a path parameter
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions(PermissionEnum.UPDATE_USER)
  updateUser(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(id, updateUserDto);  // Pass the ID to the service method
  }

}

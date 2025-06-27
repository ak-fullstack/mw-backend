import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { ReturnsService } from './returns.service';
import { CreateReturnDto } from './dto/create-return.dto';
import { UpdateReturnDto } from './dto/update-return.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Role } from 'src/roles/role/entities/role.entity';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('returns')
export class ReturnsController {
  constructor(private readonly returnsService: ReturnsService) {}

  @Post('request-return')
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles('FAM_MEMBER')
async createReturn(@Req() req, @Body() createReturnDto: CreateReturnDto) {
  const customerId = req.user?.userId; // assuming JWT has user.id
  return this.returnsService.create(createReturnDto, customerId);
}
}

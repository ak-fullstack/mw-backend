import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, UseGuards, Req } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Order } from './entities/order.entity';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

   @Post('create-order')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles('FAM_MEMBER')
  async createOrder(@Req() req,@Body() createOrderDto: CreateOrderDto) {

    
    return await this.ordersService.create(createOrderDto,req.user.userId);
  }

   @Get()
  getAllOrders(): Promise<any[]> {
    return this.ordersService.findAll();
  }

    @Get(':id')
  async findOne(@Param('id') id: number): Promise<any > {
    return await this.ordersService.findById(id);
  }

}

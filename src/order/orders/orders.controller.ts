import { Controller, Get, Post, Body, Res, Param, UsePipes, ValidationPipe, UseGuards, Req, Query } from '@nestjs/common';
import { Response } from 'express';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { QrCodeService } from 'src/qr-code/qr-code.service'; 


@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService,private readonly qrCodeService: QrCodeService) {}

   @Post('create-order')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles('FAM_MEMBER')
  async createOrder(@Req() req,@Body() createOrderDto: CreateOrderDto) {

    
    return await this.ordersService.create(createOrderDto,req.user.userId);
  }

@Get()
getAllOrders(
  @Query('id') id?: string,
  @Query('razorpayOrderId') razorpayOrderId?: string, 
  @Query('orderStatus') orderStatus?: string,
  @Query('paymentStatus') paymentStatus?: string,
 @Query('startDate') startDate?: string,
  @Query('endDate') endDate?: string,  @Query('page') page: string = '1',
  @Query('limit') limit: string = '10',
): Promise<any> {
  
  return this.ordersService.findAll({
    id,
    razorpayOrderId,
    orderStatus,
    paymentStatus,
    startDate,
    endDate,
    page: parseInt(page),
    limit: parseInt(limit),
  });
}


    @Get(':id')
  async findOne(@Param('id') id: number): Promise<any > {
    return await this.ordersService.findById(id);
  }

   @Post('generate-qr')
  async createQr(@Body('text') text: string, @Res() res: Response) {
    const buffer = await this.qrCodeService.generateQrWithText(text.toString());
    res.setHeader('Content-Type', 'image/png');
    res.send(buffer);
  }

}

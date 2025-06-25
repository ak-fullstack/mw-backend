import { Controller, Get, Post, Body, Res, Param, UsePipes, ValidationPipe, UseGuards, Req, Query, Patch } from '@nestjs/common';
import { Response } from 'express';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { QrCodeService } from 'src/qr-code/qr-code.service';
import { FindReceptionOrdersQueryDto } from './dto/reception-orders.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { StockStage } from 'src/enum/stock-stages.enum';
import { OrderStatus } from 'src/enum/order-status.enum';
import { PaymentStatus } from 'src/enum/payment-status.enum';
import { MoveToPickupDto } from './dto/move-to-pickup.dto';


@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService, private readonly qrCodeService: QrCodeService) { }

  @Post('create-order')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('FAM_MEMBER')
  async createOrder(@Req() req, @Body() createOrderDto: CreateOrderDto) {


    return await this.ordersService.create(createOrderDto, req.user.userId);
  }

  @Get()
  getAllOrders(
    @Query('id') id?: string,
    @Query('razorpayOrderId') razorpayOrderId?: string,
    @Query('orderStatus') orderStatus?: string,
    @Query('paymentStatus') paymentStatus?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string, @Query('page') page: string = '1',
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

  @Get('customer-orders')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('FAM_MEMBER')
async getCustomerOrders(@Req() req): Promise<any> {
  const userId = req.user.userId; // assuming user.id is set in JWT payload
  return await this.ordersService.getCustomerOrders(userId);
}

  @Get('reception-orders')
  getReceptionOrders(@Query() query: FindReceptionOrdersQueryDto): Promise<any> {
    return this.ordersService.findOrdersByOrderStatus({
      ...query,
      page: parseInt(query.page),
      limit: parseInt(query.limit),
      orderStatus: OrderStatus.CONFIRMED,
      paymentStatus: PaymentStatus.PAID
    });
  }

  @Get('qc-orders')
  getPickupOrders(@Query() query: FindReceptionOrdersQueryDto): Promise<any> {
    return this.ordersService.findOrdersByOrderStatus({ 
      ...query,
      page: parseInt(query.page),
      limit: parseInt(query.limit),
      orderStatus: OrderStatus.QC_CHECK,
      paymentStatus: PaymentStatus.PAID
    });
  }

  @Get('shipped-orders')
  getShippedOrders(@Query() query: FindReceptionOrdersQueryDto): Promise<any> {
    return this.ordersService.findOrdersByOrderStatus({ 
      ...query,
      page: parseInt(query.page),
      limit: parseInt(query.limit),
      orderStatus: OrderStatus.SHIPPED,
      paymentStatus: PaymentStatus.PAID
    });
  }

   @Get('packed-orders')
  getPackedOrder(@Query() query: FindReceptionOrdersQueryDto): Promise<any> {
    return this.ordersService.findOrdersByOrderStatus({ 
      ...query,
      page: parseInt(query.page),
      limit: parseInt(query.limit),
      orderStatus: OrderStatus.WAITING_PICKUP,
      paymentStatus: PaymentStatus.PAID
    });
  }


  @Patch('move-to-qc')
  moveFromStorageToQc(@Body() updateOrderStausDto: UpdateOrderStatusDto) {
    return this.ordersService.updateOrderStatus(updateOrderStausDto, StockStage.STORAGE, StockStage.QC_CHECK,OrderStatus.CONFIRMED, OrderStatus.QC_CHECK);
  }


  @Patch('move-to-courier-pickup')
  async moveFromQcToPickup(@Body() MoveToPickupDto: MoveToPickupDto) {
     await this.ordersService.saveOrderDimensions(MoveToPickupDto.orderId, {
    length: MoveToPickupDto.length,
    breadth: MoveToPickupDto.breadth,
    height: MoveToPickupDto.height,
    weight: MoveToPickupDto.weight,
  });
    return this.ordersService.updateOrderStatus(MoveToPickupDto, StockStage.QC_CHECK, StockStage.WAITING_PICKUP,OrderStatus.QC_CHECK, OrderStatus.WAITING_PICKUP);
  }

  @Patch('ship-order')
  shipOrder(@Body() updateOrderStausDto: UpdateOrderStatusDto) {
    return this.ordersService.updateOrderStatus(updateOrderStausDto, StockStage.WAITING_PICKUP, StockStage.SHIPPED,OrderStatus.WAITING_PICKUP, OrderStatus.SHIPPED);
  }

   @Patch('deliver-order')
  deliverOrder(@Body() updateOrderStausDto: UpdateOrderStatusDto) {
    return this.ordersService.updateOrderStatus(updateOrderStausDto, StockStage.SHIPPED, StockStage.DELIVERED,OrderStatus.SHIPPED, OrderStatus.DELIVERED);
  }
  




  @Get(':id')
  async findOne(@Param('id') id: number): Promise<any> {
    return await this.ordersService.findById(id);
  }

  @Post('generate-qr')
  async createQr(@Body('text') text: string, @Res() res: Response) {
    const buffer = await this.qrCodeService.generateQrWithText(text.toString());
    res.setHeader('Content-Type', 'image/png');
    res.send(buffer);
  }



}

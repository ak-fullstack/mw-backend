import { Controller, Get, Post, Body, Res, Param, UsePipes, ValidationPipe, UseGuards, Req, Query, Patch, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
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
import { RoleEnum } from 'src/enum/roles.enum';
import { CalculateItemsDto } from './dto/calculate-items.dto';
import { DataSource, EntityManager } from 'typeorm';
import { PermissionsGuard } from 'src/guards/permissions.guard';
import { RequirePermissions } from 'src/decorators/permission.decorator';
import { PermissionEnum } from 'src/enum/permissions.enum';
import { GenerateAwbDto } from './dto/generate-awb.dto';


@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService, private readonly qrCodeService: QrCodeService, private dataSource: DataSource) { }

  @Post('create-order')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.CUSTOMER)
  async createOrder(@Req() req, @Body() createOrderDto: CreateOrderDto) {


    return await this.ordersService.create(createOrderDto, req.user.userId);
  }

  @Post('calculate-order')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.CUSTOMER)
  async calculateOrderTotal(@Body() calculateItemsDto: CalculateItemsDto) {
    return await this.ordersService.calculateOrder(calculateItemsDto.items, calculateItemsDto.shippingState);
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

  @Get('order-report')
  getOrderReport(
    @Query('paymentStatus') paymentStatus?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<any> {

    return this.ordersService.orderReport({
      paymentStatus,
      startDate,
      endDate,
    });
  }

  @Get('customer-orders')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.CUSTOMER)
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

   @Get('get-awb-orders')
  getAwbOrdersOrders(@Query() query: FindReceptionOrdersQueryDto): Promise<any> {
    return this.ordersService.findOrdersByOrderStatus({
      ...query,
      page: parseInt(query.page),
      limit: parseInt(query.limit),
      orderStatus: OrderStatus.WAITING_AWB,
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
  async moveFromReservedToQc(@Body() updateOrderStausDto: UpdateOrderStatusDto) {
    return await this.dataSource.transaction(async (manager: EntityManager) => {
      return this.ordersService.updateOrderStatus(updateOrderStausDto, StockStage.RESERVED, StockStage.QC_CHECK, OrderStatus.CONFIRMED, OrderStatus.QC_CHECK, manager);
    })
  }

  @Patch('move-to-awb-generation')
  async moveToWaybillGeneration(@Body() MoveToPickupDto: MoveToPickupDto) {
    return await this.dataSource.transaction(async (manager: EntityManager) => {

      
      await this.ordersService.saveOrderDimensions(MoveToPickupDto.orderId, {
        length: MoveToPickupDto.length,
        breadth: MoveToPickupDto.breadth,
        height: MoveToPickupDto.height,
        weight: MoveToPickupDto.weight,
      }, manager);


      await this.ordersService.createShiprocketShipment(MoveToPickupDto.orderId, manager);
      return await this.ordersService.updateOrderStatus(MoveToPickupDto, StockStage.QC_CHECK, StockStage.WAITING_AWB, OrderStatus.QC_CHECK, OrderStatus.WAITING_AWB, manager);
    });

  }

   @Post('/generate-awb')
  async generateAwb(
    @Body() generateAwbDto: GenerateAwbDto
  ) {
    return this.ordersService.generateAwb(generateAwbDto);
  }

   @Get('get-available-couriers/:id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions(PermissionEnum.READ_ORDER)
  async getAvailableCouriersForOrder(@Param('id') orderId: number): Promise<any> {
    return await this.ordersService.getAvailableCourierForOrder(orderId);
  }




  // @Patch('move-to-courier-pickup')
  // async moveFromQcToPickup(@Body() MoveToPickupDto: MoveToPickupDto) {
  //   await this.ordersService.saveOrderDimensions(MoveToPickupDto.orderId, {
  //     length: MoveToPickupDto.length,
  //     breadth: MoveToPickupDto.breadth,
  //     height: MoveToPickupDto.height,
  //     weight: MoveToPickupDto.weight,
  //   });
  //   await this.ordersService.createShiprocketShipment(MoveToPickupDto.orderId);
  //   return this.ordersService.updateOrderStatus(MoveToPickupDto, StockStage.QC_CHECK, StockStage.WAITING_PICKUP, OrderStatus.QC_CHECK, OrderStatus.WAITING_PICKUP);
  // }

  @Patch('ship-order')
  async shipOrder(@Body() updateOrderStausDto: UpdateOrderStatusDto) {
    return await this.dataSource.transaction(async (manager: EntityManager) => {
      return this.ordersService.updateOrderStatus(updateOrderStausDto, StockStage.WAITING_PICKUP, StockStage.SHIPPED, OrderStatus.WAITING_PICKUP, OrderStatus.SHIPPED, manager);

    })
  }

  @Patch('deliver-order')
  async deliverOrder(@Body() updateOrderStausDto: UpdateOrderStatusDto) {
    return await this.dataSource.transaction(async (manager: EntityManager) => {
      return this.ordersService.updateOrderStatus(updateOrderStausDto, StockStage.SHIPPED, StockStage.DELIVERED, OrderStatus.SHIPPED, OrderStatus.DELIVERED, manager);
    })
  }





  @Get(':id')
  async findOne(@Param('id') id: number): Promise<any> {
    return await this.ordersService.findById(id);
  }

  @Get('success/:orderId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getOrderSuccess(
    @Param('orderId') orderId: string,
    @Req() req
  ) {
    const user = req.user.userId; // injected by auth guard
    const order = await this.ordersService.findByIdWithUser(orderId);

    if (!order) throw new NotFoundException('Order not found');

    if (order.customer.id !== user)
      throw new ForbiddenException('Not your order');

    if (order.paymentStatus !== PaymentStatus.PAID)
      throw new BadRequestException('Order is not paid');

    return {
      message: 'Order paid successfully',
      data: {
        orderId: order.id,
        amount: order.paidAmount,
        paymentMode: order.paymentSource,
        // razorpayOrderId: order.razorpayOrderId,
        date: order.paidAt || order.updatedAt,
      },
    };
  }


  @Post('generate-qr')
  async createQr(@Body('text') text: string, @Res() res: Response) {
    const buffer = await this.qrCodeService.generateQrWithText(text.toString());
    res.setHeader('Content-Type', 'image/png');
    res.send(buffer);
  }

  



}

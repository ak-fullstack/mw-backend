import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { RazorpayService } from 'src/razorpay/razorpay.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrdersService {

    constructor(
    private readonly razorpayService: RazorpayService,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}
  
 async create(createOrderDto: CreateOrderDto) {

  
    // // 1. Save order to DB
    // const newOrder = this.orderRepository.create({
    //   ...createOrderDto,
    //   // status: 'PENDING',
    // });
    // await this.orderRepository.save(newOrder);

    // // 2. Create Razorpay order
    // const razorpayOrder = await this.razorpayService.createOrder(newOrder.totalAmount);

    // // 3. Attach Razorpay order ID to DB
    // newOrder.razorpayOrderId = razorpayOrder.id;
    // await this.orderRepository.save(newOrder);

    // // 4. Return response for frontend
    // return {
    //   razorpayOrderId: razorpayOrder.id,
    //   razorpayKeyId: process.env.RAZORPAY_KEY_ID,
    //   amount: razorpayOrder.amount,
    //   currency: razorpayOrder.currency,
    // };
  }



  findAll() {
    return `This action returns all orders`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}

import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Order } from '../orders/entities/order.entity';
import { DataSource, Repository } from 'typeorm';
import { PaymentStatus } from 'src/enum/payment-status.enum';
import { OrderStatus } from 'src/enum/order-status.enum';

@Injectable()
export class PaymentsService {

  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {

  }

  async updatePaymentStatusViaWebhook(payload: any) {
    const razorpayOrderId = payload.payload.payment.entity.order_id;
    const razorpayPaymentId = payload.payload.payment.entity.id;
    const amount = payload.payload.payment.entity.amount / 100;
    const event = payload.event;
    const paymentMethod = payload.payload.payment.entity.method;
    const createdAt = new Date(payload.payload.payment.entity.created_at * 1000);


    const order = await this.orderRepository.findOne({ where: { razorpayOrderId } });
    if (!order) throw new Error('Order not found');

     if (order.paymentStatus !== PaymentStatus.PAID) {
    if (event === 'payment.failed') {
      order.paymentStatus = PaymentStatus.FAILED;
      order.orderStatus = OrderStatus.CANCELLED;
    } else if (event === 'payment.captured') {
      order.paymentStatus = PaymentStatus.PAID;
      order.orderStatus = OrderStatus.CONFIRMED;
      order.successfulPaymentId = razorpayPaymentId;
    } else {
      order.paymentStatus = PaymentStatus.PENDING;
    }
    await this.orderRepository.save(order);
  }


    let payment = await this.paymentRepository.findOne({ where: { razorpayPaymentId } });

    if (!payment) {
      payment = this.paymentRepository.create({
        razorpayPaymentId,
        amount,
        order,
        status: payload.payload.payment.entity.status,
        paymentMethod,
        createdAt
      });
    } else {
      payment.status = payload.payload.payment.entity.status;
    }

    await this.paymentRepository.save(payment);
  }

  async updatePaymentStatusManually(latestPayment:any){
    const razorpayOrderId = latestPayment.order_id;
  const razorpayPaymentId = latestPayment.id;
  const amount = latestPayment.amount / 100;
  const status = latestPayment.status; // 'captured', 'failed', 'authorized', etc.
  const paymentMethod = latestPayment.method;
  const createdAt = new Date(latestPayment.created_at * 1000);

  const order = await this.orderRepository.findOne({ where: { razorpayOrderId } });
  if (!order) throw new NotFoundException('Order not found.');

  if (order.paymentStatus === PaymentStatus.PAID) throw new BadRequestException('Order is already paid');

     if (status === 'captured') {
    order.paymentStatus = PaymentStatus.PAID;
    order.orderStatus = OrderStatus.CONFIRMED;
    order.successfulPaymentId = razorpayPaymentId;
  } else if (status === 'failed') {
    order.paymentStatus = PaymentStatus.FAILED;
    order.orderStatus = OrderStatus.CANCELLED;
  } else {
    // 'authorized' or other non-final states
    order.paymentStatus = PaymentStatus.PENDING;
  }

  await this.orderRepository.save(order);

  // 4. Update or create payment record
  let payment = await this.paymentRepository.findOne({ where: { razorpayPaymentId } });

  if (!payment) {
    payment = this.paymentRepository.create({
      razorpayPaymentId,
      amount,
      order,
      status,
      paymentMethod,
      createdAt
    });
  } else {
    payment.status = status;
  }

  await this.paymentRepository.save(payment);

  return { message: `Order and payment updated with status: ${status}` };

  }

}

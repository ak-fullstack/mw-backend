import {Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Order } from '../orders/entities/order.entity';
import { Repository } from 'typeorm';
import { PaymentStatus } from 'src/enum/payment-status.enum';

@Injectable()
export class PaymentsService {

  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {

  }

  async updatePaymentStatus(payload: any) {
    const razorpayOrderId = payload.payload.payment.entity.order_id;
    const razorpayPaymentId = payload.payload.payment.entity.id;
    const amount = payload.payload.payment.entity.amount / 100;
    const status = payload.event; // e.g., 'payment.captured', 'payment.failed'

    const order = await this.orderRepository.findOne({ where: { razorpayOrderId } });
    if (!order) throw new Error('Order not found');

    let payment = await this.paymentRepository.findOne({ where: { razorpayPaymentId } });

    if (!payment) {
      payment = this.paymentRepository.create({
        razorpayPaymentId,
        amount,
        order,
        status,
      });
    } else {
      payment.status = status;
    }

    await this.paymentRepository.save(payment);
    if (status === 'payment.captured') {
    order.paymentStatus = PaymentStatus.PAID;
    await this.orderRepository.save(order);
  }
  }

}

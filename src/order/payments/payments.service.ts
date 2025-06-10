import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Order } from '../orders/entities/order.entity';
import { DataSource, Repository } from 'typeorm';
import { PaymentStatus } from 'src/enum/payment-status.enum';

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
    const status = payload.event; // e.g., 'payment.captured', 'payment.failed'

    const order = await this.orderRepository.findOne({ where: { razorpayOrderId } });
    if (!order) throw new Error('Order not found');

    let payment = await this.paymentRepository.findOne({ where: { razorpayPaymentId } });

    if (!payment) {
      payment = this.paymentRepository.create({
        razorpayPaymentId,
        amount,
        order,
        status:payload.payload.payment.entity.status,
      });
    } else {
      payment.status = payload.payload.payment.entity.status;
    }

    await this.paymentRepository.save(payment);
    if (status === 'payment.captured') {
      order.paymentStatus = PaymentStatus.PAID;
      await this.orderRepository.save(order);
    }
  }

 async updateSuccessfulpaymentManually(successfulPayment) {
  await this.dataSource.transaction(async (manager) => {
    const paymentId = successfulPayment.id;
    const orderId = successfulPayment.order_id;
    const amount = successfulPayment.amount;
    const method = successfulPayment.method;
    const status = successfulPayment.status;
    const paidAt = successfulPayment.created_at

    const order = await manager.findOne(Order, {
      where: { razorpayOrderId: orderId },
    });

    if (!order) {
      throw new NotFoundException(`Order with Razorpay Order ID ${orderId} not found`);
    }

    if (order.paymentStatus === PaymentStatus.PAID) {
      throw new ConflictException(`Order already marked as paid`);
    }

    order.paymentStatus = PaymentStatus.PAID;
    order.successfulPaymentId = paymentId;
    order.paymentMethod = method;
    order.paidAmount = amount;
    order.paidAt = new Date(paidAt * 1000);

    await manager.save(Order, order);

    const payment = this.paymentRepository.create({
      razorpayPaymentId: paymentId,
      amount,
      method,
      status,
      order,
    });

    await manager.save(Payment, payment);
  });

  return
}

}

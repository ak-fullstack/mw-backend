import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Order } from '../orders/entities/order.entity';
import { DataSource, Repository } from 'typeorm';
import { PaymentStatus } from 'src/enum/payment-status.enum';
import { OrderStatus } from 'src/enum/order-status.enum';
import { Wallet } from 'src/customer/wallet/entities/wallet.entity';
import { WalletService } from 'src/customer/wallet/wallet.service';
import { WalletTransactionReason } from 'src/customer/wallet-transaction/entities/wallet-transaction.entity';
import { SocketsGateway } from 'src/sockets/sockets.gateway';

@Injectable()
export class PaymentsService {

  constructor(
    private readonly walletService: WalletService,
    private readonly dataSource: DataSource,
    private readonly socketGateway: SocketsGateway

  ) {

  }

  async updatePaymentStatusViaWebhook(payload: any) {
    await this.dataSource.transaction(async (manager) => {
      const razorpayOrderId = payload.payload.payment.entity.order_id;
      const razorpayPaymentId = payload.payload.payment.entity.id;
      const amount = payload.payload.payment.entity.amount / 100;
      const event = payload.event;
      const paymentMethod = payload.payload.payment.entity.method;
      const createdAt = new Date(payload.payload.payment.entity.created_at * 1000);
      const orderRepository = manager.getRepository(Order);

      const order = await orderRepository.findOne({ where: { razorpayOrderId }, relations: ['customer'] });
      if (!order) throw new Error('Order not found');

      if (order.paymentStatus !== PaymentStatus.PAID) {
        if (event === 'payment.failed') {
          order.paymentStatus = PaymentStatus.FAILED;
          order.orderStatus = OrderStatus.CANCELLED;
        } else if (event === 'payment.captured') {
          order.paymentStatus = PaymentStatus.PAID;
          order.orderStatus = OrderStatus.CONFIRMED;
          order.successfulPaymentId = razorpayPaymentId;
          order.paymentMethod = paymentMethod;
          order.razorpayAmountPaid = amount;
          order.paidAmount = Number((Number(amount) + Number(order.walletAmountUsed)).toFixed(2));
          order.paidAt = createdAt;

          if (order.paymentSource === 'wallet+razorpay') {
            const walletAmount = order.walletAmountUsed ?? 0;
            if (walletAmount > 0) {

              await this.walletService.debit(order.customer.id, order.id, WalletTransactionReason.ORDER_PAYMENT, order.walletAmountUsed, manager);
              order.usedWallet = true;


            }
          }
        } else {
          order.paymentStatus = PaymentStatus.PENDING;
        }
        await orderRepository.save(order);

      }

      const paymentRepository = manager.getRepository(Payment);


      let payment = await paymentRepository.findOne({ where: { razorpayPaymentId } });

      if (!payment) {
        payment = paymentRepository.create({
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
      await paymentRepository.save(payment);
       if (order.paymentStatus === PaymentStatus.PAID) {
        this.socketGateway.notifyNewOrder(order.id);
      }
    });

  }

  async updatePaymentStatusManually(latestPayment: any) {
    return this.dataSource.transaction(async (manager) => {
      const razorpayOrderId = latestPayment.order_id;
      const razorpayPaymentId = latestPayment.id;
      const amount = latestPayment.amount / 100;
      const status = latestPayment.status;
      const paymentMethod = latestPayment.method;
      const createdAt = new Date(latestPayment.created_at * 1000);

      const orderRepository = manager.getRepository(Order);
      const paymentRepository = manager.getRepository(Payment);



      const order = await orderRepository.findOne({ where: { razorpayOrderId }, relations: ['customer'] });
      if (!order) throw new NotFoundException('Order not found.');

      if (order.paymentStatus === PaymentStatus.PAID)
        throw new BadRequestException('Order is already paid');

      if (status === 'captured') {
        order.paymentStatus = PaymentStatus.PAID;
        order.orderStatus = OrderStatus.CONFIRMED;
        order.successfulPaymentId = razorpayPaymentId;
        order.paymentMethod = paymentMethod;
        order.razorpayAmountPaid = amount;
        order.paidAmount = Number((Number(amount) + Number(order.walletAmountUsed)).toFixed(2));
        order.paidAt = createdAt;

        if (order.paymentSource === 'wallet+razorpay') {
          const walletAmount = order.walletAmountUsed ?? 0;
          if (walletAmount > 0) {

            await this.walletService.debit(
              order.customer.id,
              order.id,
              WalletTransactionReason.ORDER_PAYMENT,
              order.walletAmountUsed,
              manager,
            );
            order.usedWallet = true;

          }
        }
      } else if (status === 'failed') {
        order.paymentStatus = PaymentStatus.FAILED;
        order.orderStatus = OrderStatus.CANCELLED;
      } else {
        order.paymentStatus = PaymentStatus.PENDING;
      }

      try {
        await orderRepository.save(order);
      } catch (error) {
        console.error('Error while saving order:', error);
        throw new InternalServerErrorException('Failed to save order');
      }

      let payment = await paymentRepository.findOne({ where: { razorpayPaymentId } });
      if (!payment) {
        payment = paymentRepository.create({
          razorpayPaymentId,
          amount,
          order,
          status,
          paymentMethod,
          createdAt,
        });
      } else {
        payment.status = status;
      }

      await paymentRepository.save(payment);

      if (order.paymentStatus === PaymentStatus.PAID) {
        this.socketGateway.notifyNewOrder(order.id);
      }
      return { message: `Order and payment updated with status: ${status}` };
    });
  }



}

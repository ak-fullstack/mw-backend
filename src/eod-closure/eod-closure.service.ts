import { Injectable } from '@nestjs/common';
import { CreateEodClosureDto } from './dto/create-eod-closure.dto';
import { UpdateEodClosureDto } from './dto/update-eod-closure.dto';
import { Between, EntityManager, Repository } from 'typeorm';
import { EodClosure } from './entities/eod-closure.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/order/orders/entities/order.entity';
import { PaymentStatus } from 'src/enum/payment-status.enum';
import { start } from 'repl';
import { Return } from 'src/order/returns/entities/return.entity';
import { ReturnResolutionMethod } from 'src/enum/resolution-method.enum';


@Injectable()
export class EodClosureService {

  constructor(private readonly manager: EntityManager,
    @InjectRepository(EodClosure)
    private readonly eodClosureRepo: Repository<EodClosure>,
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(Return)
    private readonly returnRepo: Repository<Return>
  ) { }


  async generateEodReport() {
    const lastClosures = await this.eodClosureRepo.find({
      order: { closureTime: 'DESC' },
      take: 2,
    });

    if (lastClosures.length === 0) {
      throw new Error('No EOD entries found.');
    }

    const classification = this.isTodayOrYesterdayInIST(lastClosures[0].closureTime.toISOString());


    let startTime: any;
    let endTime: any;

    //     if (classification === 'today') {
    //   if (lastClosures.length < 2) {
    //     throw new Error('Cannot find previous EOD for today\'s report.');
    //   }
    //   startTime = new Date(lastClosures[1].closureTime); // second last
    //   endTime = new Date(lastClosures[0].closureTime);   // last
    // } else if (classification === 'yesterday') {
    //   startTime = new Date(lastClosures[0].closureTime);
    //   endTime = new Date(); // now in UTC
    // } else {
    //   throw new Error('Last EOD entry is neither today nor yesterday in IST.');
    // }


    startTime = '2025-07-01 18:08:00';
    endTime = '2025-07-28 23:50:00';



    const paidOrders = await this.orderRepo.find({
      where: {
        createdAt: Between(startTime, endTime),
        paymentStatus: PaymentStatus.PAID,
      },
      relations: ['items.productVariant.product'], // Include other relations if needed
    });

    const productSalesMap = new Map<any, number>();

    for (const order of paidOrders) {
      for (const item of order.items) {
        const productId = item.productVariant.product.id;
        const quantity = item.quantity || 1;

        const currentQty = productSalesMap.get(productId) || 0;
        productSalesMap.set(productId, currentQty + quantity);
      }
    }

    // Find product with the highest quantity sold
    let topProductId = null;
    let maxSold = 0;

    for (const [productId, qty] of productSalesMap.entries()) {
      if (qty > maxSold) {
        maxSold = qty;
        topProductId = productId;
      }
    }

    const topProductName = paidOrders
  .flatMap(order => order.items)
  .find(item => item.productVariant.product.id === topProductId)?.productVariant.product.name || null;

    let orderCount = 0;
    let totalOrderValue = 0;
    let totalDiscount = 0;
    let totalAmountCollected = 0;
    let totalCgst = 0;
    let totalSgst = 0;
    let totalIgst = 0;
    let totalTax = 0;
    let totalDelvieryCharge = 0;

    for (const order of paidOrders) {
      orderCount++;
      totalDelvieryCharge += order.deliveryCharge;
      for (const item of order.items) {
        totalOrderValue += item.subTotal;
        totalDiscount += item.discountAmount || 0;
        totalAmountCollected += item.totalAmount
        if (item.gstType === 'CGST_SGST') {
          totalCgst += (item.itemCgstAmount || 0) + (item.deliveryCgstAmount || 0);
          totalSgst += (item.itemSgstAmount || 0) + (item.deliverySgstAmount || 0);
        } else if (item.gstType === 'IGST') {
          totalIgst += (item.itemIgstAmount || 0) + (item.deliveryIgstAmount || 0);
        }
        totalTax += item.totalTaxAmount;
      }
    }

    const returns = await this.returnRepo.find({
      where: {
        createdAt: Between(startTime, endTime),
      },
      relations: ['items'],
    });

    for (const ret of returns) {
      ret.items = ret.items.filter(item => item.resolutionMethod === 'WALLET_REFUND');
    }

    let refundCount = 0;
    let refundValue = 0;
    let refundAmountCollcted = 0;
    let refundCgst = 0;
    let refundSgst = 0;
    let refundIgst = 0;
    let refundTax = 0;
    let refundDeliveryCharge = 0;

    for (const ret of returns) {
      refundCount++;
      for (const item of ret.items) {
        if (item.resolutionMethod !== ReturnResolutionMethod.WALLET_REFUND) continue;

        refundValue += item.subTotal;
        refundAmountCollcted += item.totalAmount;

        refundCgst += (item.itemCgstAmount || 0) + (item.deliveryCgstAmount || 0);
        refundSgst += (item.itemSgstAmount || 0) + (item.deliverySgstAmount || 0);
        refundIgst += (item.itemIgstAmount || 0) + (item.deliveryIgstAmount || 0);
        refundTax += item.totalTaxAmount;
        refundDeliveryCharge += item.deliveryCharge || 0;
      }
    }



    return {
  order: {
    orderCount,
    totalOrderValue: Number(totalOrderValue.toFixed(2)),
    totalDiscount: Number(totalDiscount.toFixed(2)),
    totalDelvieryCharge: Number(totalDelvieryCharge.toFixed(2)),
    totalAmountCollected: Number(totalAmountCollected.toFixed(2)),
    totalCgst: Number(totalCgst.toFixed(2)),
    totalSgst: Number(totalSgst.toFixed(2)),
    totalIgst: Number(totalIgst.toFixed(2)),
    totalTax: Number(totalTax.toFixed(2)),
  },
  refund: {
    refundCount,
    refundValue: Number(refundValue.toFixed(2)),
    refundAmountCollcted: Number(refundAmountCollcted.toFixed(2)),
    refundCgst: Number(refundCgst.toFixed(2)),
    refundSgst: Number(refundSgst.toFixed(2)),
    refundIgst: Number(refundIgst.toFixed(2)),
    refundTax: Number(refundTax.toFixed(2)),
    refundDeliveryCharge: Number(refundDeliveryCharge.toFixed(2)),
  },
  netCollection: {
    netValue: Number((totalOrderValue - refundValue).toFixed(2)),
    netAmountCollected: Number((totalAmountCollected - refundAmountCollcted).toFixed(2)),
    netDeliveryCharge: Number((totalDelvieryCharge - refundDeliveryCharge).toFixed(2)),
    netCgst: Number((totalCgst - refundCgst).toFixed(2)),
    netSgst: Number((totalSgst - refundSgst).toFixed(2)),
    netIgst: Number((totalIgst - refundIgst).toFixed(2)),
    netTax: Number((totalTax - refundTax).toFixed(2)),
  },
  topProduct: {
    productId: topProductId,
    quantitySold: maxSold,
    name: topProductName,
  },
      
    }

  }


  isTodayOrYesterdayInIST(utcTimestamp: string): 'today' | 'yesterday' | 'other' {
    const istTimezone = 'Asia/Kolkata';

    // Convert UTC timestamp to IST date object
    const istDateFromUTC = new Date(
      new Date(utcTimestamp).toLocaleString('en-US', { timeZone: istTimezone })
    );

    // Get current IST datetime
    const istNow = new Date(
      new Date().toLocaleString('en-US', { timeZone: istTimezone })
    );

    // Get just the date parts (zero out time)
    const inputDate = new Date(istDateFromUTC.getFullYear(), istDateFromUTC.getMonth(), istDateFromUTC.getDate());
    const todayDate = new Date(istNow.getFullYear(), istNow.getMonth(), istNow.getDate());

    // Get yesterday IST date
    const yesterdayDate = new Date(todayDate);
    yesterdayDate.setDate(todayDate.getDate() - 1);

    // Compare
    if (inputDate.getTime() === todayDate.getTime()) {
      return 'today';
    } else if (inputDate.getTime() === yesterdayDate.getTime()) {
      return 'yesterday';
    } else {
      return 'other';
    }
  }

}

import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { PaymentsService } from 'src/order/payments/payments.service';
const Razorpay = require('razorpay');

@Injectable()
export class RazorpayService {

  private razorpay: any;
  private readonly webhookSecret:string;


  constructor(private configService: ConfigService,
    private paymentsService:PaymentsService
  ) {
    this.razorpay = new Razorpay({
      key_id: this.configService.get<string>('RAZORPAY_KEY_ID'),
      key_secret: this.configService.get<string>('RAZORPAY_KEY_SECRET'),
    });
    this.webhookSecret = this.configService.get<string>('RAZORPAY_WEH_HOOK_SECRET') || '';


  }


  async createOrder(amount: number, currency = 'INR') {
    const options = {
      amount: amount * 100, // in paise
      currency,
      payment_capture: 1,
      receipt: `receipt_${Date.now().toString() + Math.floor(Math.random() * 1000).toString()}`,
    };
    return await this.razorpay.orders.create(options);
  }

  async processWebhook(payload: any, signature: string | string[] | undefined): Promise<void> {
    this.verifyWebhookSignature(JSON.stringify(payload), signature);
     await this.paymentsService.updatePaymentStatus(payload);
    return;
  }


   private verifyWebhookSignature(payload: string, signature: string | string[] | undefined): void {
    if (!signature || Array.isArray(signature)) {
      throw new BadRequestException('Invalid or missing signature header');
    }

    const expectedSignature = crypto
      .createHmac('sha256', this.webhookSecret)
      .update(payload)
      .digest('hex');
      console.log(expectedSignature);
      
    if (expectedSignature !== signature) {
      throw new BadRequestException('Invalid webhook signature');
    }
    return
  }

}

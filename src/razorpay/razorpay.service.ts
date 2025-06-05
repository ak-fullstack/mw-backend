import { Injectable } from '@nestjs/common';
import { CreateRazorpayDto } from './dto/create-razorpay.dto';
import { UpdateRazorpayDto } from './dto/update-razorpay.dto';
import { ConfigService } from '@nestjs/config';

const Razorpay = require('razorpay');



@Injectable()
export class RazorpayService {
  
    private razorpay: any;


  constructor(private configService: ConfigService) {
     this.razorpay = new Razorpay({
      key_id: this.configService.get<string>('RAZORPAY_KEY_ID'),
      key_secret: this.configService.get<string>('RAZORPAY_KEY_SECRET'),
    });
  }

  async createOrder(amount: number, currency = 'INR') {
    const options = {
      amount: amount * 100, // in paise
      currency,
      payment_capture: 1,
    };
    return this.razorpay.orders.create(options);
  }

}

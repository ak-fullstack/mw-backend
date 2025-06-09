import { Controller, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import { RazorpayService } from './razorpay.service';

@Controller('razorpay')
export class RazorpayController {

      constructor(private readonly razorpayService: RazorpayService) {}
    

@Post('webhook')
@HttpCode(HttpStatus.OK)
async handleWebhook(@Req() req: Request) {
  await this.razorpayService.processWebhook(req.body, req.headers['x-razorpay-signature']);
  console.log('Webhook processed successfully');
  
  return 'Webhook processed successfully';
}
}

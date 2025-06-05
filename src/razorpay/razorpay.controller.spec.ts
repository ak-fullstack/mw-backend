import { Test, TestingModule } from '@nestjs/testing';
import { RazorpayController } from './razorpay.controller';
import { RazorpayService } from './razorpay.service';

describe('RazorpayController', () => {
  let controller: RazorpayController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RazorpayController],
      providers: [RazorpayService],
    }).compile();

    controller = module.get<RazorpayController>(RazorpayController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RazorpayService } from './razorpay.service';
import { CreateRazorpayDto } from './dto/create-razorpay.dto';
import { UpdateRazorpayDto } from './dto/update-razorpay.dto';

@Controller('razorpay')
export class RazorpayController {
  constructor(private readonly razorpayService: RazorpayService) {}

}

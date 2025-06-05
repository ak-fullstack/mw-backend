import { PartialType } from '@nestjs/mapped-types';
import { CreateRazorpayDto } from './create-razorpay.dto';

export class UpdateRazorpayDto extends PartialType(CreateRazorpayDto) {}

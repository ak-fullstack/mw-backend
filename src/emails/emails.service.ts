import { Injectable } from '@nestjs/common';
import { CreateEmailDto } from './dto/create-email.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class EmailsService {

  private transporter: nodemailer.Transporter;

    // this.transporter = nodemailer.createTransport({
    //   host: 'smtp-relay.brevo.com',
    //   port: 587,
    //   secure: false,
    //   auth: {
    //     user: '8908f3002@smtp-brevo.com',
    //     pass: 'sKqnA46DL978JOzB',
    //   },
    // });

  constructor(private configService:ConfigService) {
  this.transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,               // Use 465 for SSL, or 587 for TLS (recommended)
    secure: false,           // true for port 465, false for 587
    auth: {
      user: this.configService.get<string>('GOOGLE_MAILER'),       // Your Gmail address
      pass: this.configService.get<string>('GOOGLE_MAILER_PASSWORD'),          // App Password (no spaces)
    },
  });
}


  async sendOtpMail(emailId:string,code:string): Promise<void> {

    const mailOptions = {
      from: this.configService.get<string>('GOOGLE_MAILER'),
      to: emailId,
      subject: 'Your OTP for Motowagon Login',
      text: 'OTP: '+code,
    };

    this.transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent successfully:', info.response);
      }
    });

  }
}

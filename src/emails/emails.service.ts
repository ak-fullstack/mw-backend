import { Injectable } from '@nestjs/common';
import { CreateEmailDto } from './dto/create-email.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import * as nodemailer from 'nodemailer';


@Injectable()
export class EmailsService {

  private transporter: nodemailer.Transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587, // Use 465 for SSL
      secure: false, // true for 465
      auth: {
        user: '8908f3002@smtp-brevo.com', // Your verified email
        pass: 'sKqnA46DL978JOzB', // Found in SMTP settings
      },
    });
  }


  async sendOtpMail(emailId:string): Promise<void> {

    const mailOptions = {
      from: 'londonammurose@gmail.com',
      to: emailId,
      subject: 'Your OTP',
      text: 'otp:1111',
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

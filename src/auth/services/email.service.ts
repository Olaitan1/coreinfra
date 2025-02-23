import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from 'src/config/config.service';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    
    this.transporter = nodemailer.createTransport({
      service: 'gmail', 
      auth: {
        user: this.configService.senderEmail, 
        pass: this.configService.emailPassword, 
      },
    });
  }

  private async sendEmail(payload: {
    to: string;
    from: string;
    subject: string;
    html: string;
    attachments?: Array<any>;
  }) {
    try {
      const info = await this.transporter.sendMail(payload);
      console.info(`Mail Sent: ${info.messageId}`);
      return info;
    } catch (err) {
      console.error('Email error >> ', err);
      return false;
    }
  }

  // Forgot Password Email
  forgotUserPassword = async (user: User) => {
    try {
      const msg = {
        to: user.email, 
        from: this.configService.senderEmail, 
        subject: 'Password Reset',
        html: `
          Hello ${user.firstName},      
          <br><br>
          We received a request to reset your password.

          <br>
          If you initiated this request, use the code below to change your password:

          <br><br>
          <b>${user.otp}</b>
          <br>

          <br>
          Code will expire in 5 minutes.
          <br><br>

          If you didn't make this request, please ignore the above code and login with your existing password. You may also report this incident to support@ola.com
          <br><br>
          Team COREINFRAHQ
        `,
      };

      await this.sendEmail(msg);
    } catch (error: any) {
      console.error(error.stack);
    }
  };

  // Verify Email
  verifyEmail = async (user: User) => {
    try {
      const msg = {
        to: user.email,
        from: this.configService.senderEmail,
        subject: 'Verify Email',
        html: `
          Hello ${user.firstName},      
          <br><br>
          We received a request to verify your email.

          <br>
          If you initiated this request, use the code below to verify your email:

          <br><br>
          <b>${user.otp}</b>
          <br>

          <br>
          Code will expire in 5 minutes.
          <br><br>

          If you didn't make this request, please ignore the above code and login with your existing password. You may also report this incident to
          <br><br>
          Team COREINFRAHQ
        `,
      };

      await this.sendEmail(msg);
    } catch (error: any) {
      console.error(error.stack);
    }
  };
};

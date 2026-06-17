import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    // 🎯 Set up local SMTP or standard transport rules (e.g., Mailtrap for local development, Resend/Sendgrid for production)
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'sandbox.smtp.mailtrap.io',
    //   @ts-ignore
      port: parseInt(process.env?.EMAIL_PORT) || 2525,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendVerificationEmail(email: string, token: string) {
    const url = `http://localhost:3000/verify-email?token=${token}`;
    await this.transporter.sendMail({
      from: '"Fusion AI Security" <security@fusionai.com>',
      to: email,
      subject: 'Verify Your Fusion Infrastructure Node',
      html: `<h3>Welcome to Fusion AI</h3>
             <p>Please click the secure layout tracking link below to finalize your tenant workspace setup:</p>
             <a href="${url}">Verify Registration</a>`,
    });
  }

  async sendResetPasswordEmail(email: string, token: string) {
    const url = `http://localhost:3000/reset-password?token=${token}`;
    await this.transporter.sendMail({
      from: '"Fusion AI Recovery" <security@fusionai.com>',
      to: email,
      subject: 'Reset Password Matrix Key Requests',
      html: `<p>A password reset was requested for your node. Click the secure link below to update your password:</p>
             <a href="${url}">Reset Password</a>
             <p>This tracking link expires in exactly 1 hour.</p>`,
    });
  }
}
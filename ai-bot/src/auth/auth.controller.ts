import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  HttpCode,
  HttpStatus,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthService } from './auth.service';
import { User } from 'src/user/user.schema';
import { Tenant } from 'src/tenant/tenant.schema';
import { EmailService } from './email.service';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

@Controller('auth')
export class AuthController {
  constructor(
    // 🎯 FIXED: Re-injected your missing AuthService dependency
    private readonly authService: AuthService,
    
    // 🎯 FIXED: Setup clean Mongoose Model bindings with proper type declarations
    @InjectModel(User.name) private readonly userService: Model<User>,
    @InjectModel(Tenant.name) private readonly tenantService: Model<Tenant>,
    private readonly emailService: EmailService,
  ) {}

  /**
   * 🏢 POST /auth/register
   * Registers a brand new tenant organization and provisions its primary admin user.
   */
  @Post('register')
  async register(@Body() registerDto: any) {
    console.log(
      `🚀 Received self-service registration request for: ${registerDto.businessName}`,
    );
    return this.authService.registerTenantAccount(registerDto);
  }

  /**
   * 🔐 POST /auth/login
   * Validates user credentials and signs a payload containing the tenantId anchor.
   */
  @Post('login')
  @HttpCode(HttpStatus.OK) // 🎯 FIXED: Extracted missing HttpStatus parameters cleanly
  async login(@Body() loginDto: any) {
    return this.authService.login(loginDto);
  }

  /**
   * 📧 GET /auth/verify-email?token=...
   * Updates verification state flags once email links are activated
   */
  @Get('verify-email')
  async verifyEmail(@Query('token') token: string) {
    if (!token) {
      throw new BadRequestException('Verification token context missing.');
    }

    const user = await this.userService.findOne({
      emailVerificationToken: token,
    });
    
    if (!user) {
      throw new BadRequestException('Token invalid or expired.');
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined; // Destroy token string once validated
    await user.save();

    return {
      success: true,
      message: 'Node identity successfully verified. You may now login.',
    };
  }

  /**
   * 🔑 POST /auth/forgot-password
   * Sets up temporary expiring token fields when a user forgets credentials
   */
  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    const user = await this.userService.findOne({ email });
    if (!user) {
      throw new NotFoundException(
        'No active account associated with that email.',
      );
    }

    // 🎯 FIXED: Using secure cryptographically generated token keys
    const token = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = token;
    user.passwordResetExpires = new Date(Date.now() + 3600000); // 1 hour lifetime window
    await user.save();

    await this.emailService.sendResetPasswordEmail(user.email, token);

    return {
      success: true,
      message: 'Recovery pipeline transmission delivered to input address.',
    };
  }

  /**
   * 🛠️ POST /auth/reset-password
   * Applies the newly generated password string if the token is valid
   */
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() body: any) {
    const { token, newPassword } = body;

    const user = await this.userService.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: new Date() }, // Verifies token expiration has not passed
    });

    if (!user) {
      throw new BadRequestException(
        'Reset window token is invalid or has expired.',
      );
    }

    // 🎯 FIXED: Salting and processing bcrypt hashes for the incoming credential block
    user.password = await bcrypt.hash(newPassword, 10);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return {
      success: true,
      message: 'Account access credential recalibrated successfully.',
    };
  }
}
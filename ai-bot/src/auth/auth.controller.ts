import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 🏢 POST /auth/register
   * Registers a brand new tenant organization and provisions its primary admin user.
   */
@Post('register')
  async register(@Body() registerDto: any) {
    console.log(`🚀 Received self-service registration request for: ${registerDto.businessName}`);
    return this.authService.registerTenantAccount(registerDto);
  }
  /**
   * 🔐 POST /auth/login
   * Validates user credentials and signs a payload containing the tenantId anchor.
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: any) {
    return this.authService.login(loginDto);
  }
}
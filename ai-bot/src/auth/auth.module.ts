import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { EmailService } from './email.service'; // 🚀 1. IMPORT YOUR EMAIL SERVICE
import { User, UserSchema } from 'src/user/user.schema';
import { Tenant, TenantSchema } from 'src/tenant/tenant.schema';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Tenant.name, schema: TenantSchema },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'fallback_secret_key',
      signOptions: { expiresIn: '8h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService, 
    EmailService // 🎯 2. REGISTER IT AS A PROVIDER HERE
  ],
  exports: [AuthService],
})
export class AuthModule {}
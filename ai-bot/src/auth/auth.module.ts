import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { EmailService } from './email.service';
import { JwtStrategy } from './strategies/jwt.strategy'; // 🚀 1. IMPORT YOUR JWT STRATEGY (Adjust path if it's directly in /auth)
import { User, UserSchema } from 'src/user/user.schema';
import { Tenant, TenantSchema } from 'src/tenant/tenant.schema';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }), // Ensure Passport handles JWT by default
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
    EmailService,
    JwtStrategy // 🎯 2. REGISTER IT AS A PROVIDER HERE SO PASSPORT SEES IT!
  ],
  exports: [AuthService, PassportModule],
})
export class AuthModule {}
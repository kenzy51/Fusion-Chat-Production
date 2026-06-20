import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { EmailService } from './email.service'; 
import { JwtStrategy } from './strategies/jwt.strategy'; 
import { User, UserSchema } from 'src/user/user.schema';
import { Tenant, TenantSchema } from 'src/tenant/tenant.schema';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Tenant.name, schema: TenantSchema },
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }), 
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'fallback_secret_key',
      signOptions: { expiresIn: '8h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService, 
    EmailService,
    JwtStrategy
  ],
  // 🎯 EXPORTING JwtModule HERE ELIMINATES THE NESTJS DEPENDENCY CRASH IN TENANTMODULE!
  exports: [AuthService, PassportModule, JwtStrategy, JwtModule], 
})
export class AuthModule {}
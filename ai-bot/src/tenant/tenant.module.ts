import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TenantService } from './tenant.service';
import { PublicTenantController, TenantController } from './tenant.controller'; // 🚀 IMPORT THE CONTROLLER
import { Tenant, TenantSchema } from './tenant.schema';
import { UserModule } from '../user/user.module'; // Needed if you are querying the User model inside TenantController
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tenant.name, schema: TenantSchema }]),
    UserModule,
    AuthModule, // 🚀 Ensure this is here if your controller injects the UserModel
  ],
  providers: [TenantService],
  controllers: [TenantController,PublicTenantController], // 🎯 THIS IS CRITICAL! NestJS needs this to register the routes.
  exports: [MongooseModule],
})
export class TenantModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TenantService } from './tenant.service';
import { TenantController } from './tenant.controller'; // 🚀 IMPORT THE CONTROLLER
import { Tenant, TenantSchema } from './tenant.schema';
import { UserModule } from '../user/user.module'; // Needed if you are querying the User model inside TenantController

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tenant.name, schema: TenantSchema }]),
    UserModule, // 🚀 Ensure this is here if your controller injects the UserModel
  ],
  providers: [TenantService],
  controllers: [TenantController], // 🎯 THIS IS CRITICAL! NestJS needs this to register the routes.
  exports: [MongooseModule],
})
export class TenantModule {}
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TenantService } from './tenant.service';
import { TenantController, PublicTenantController } from './tenant.controller'; 
import { Tenant, TenantSchema } from './tenant.schema';
import { UserModule } from '../user/user.module'; 
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tenant.name, schema: TenantSchema }]),
    UserModule,
    AuthModule, 
  ],
  providers: [TenantService],
  controllers: [TenantController, PublicTenantController], 
  exports: [MongooseModule],
})
export class TenantModule {}
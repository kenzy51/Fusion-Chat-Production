import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TenantService } from './tenant.service';
import { TenantController, PublicTenantController } from './tenant.controller'; 
import { Tenant, TenantSchema } from './tenant.schema';
import { UserModule } from '../user/user.module'; 
import { AuthModule } from 'src/auth/auth.module';
import { ChatService } from 'src/ai-agent/gemini/chat.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tenant.name, schema: TenantSchema }]),
    UserModule,
    AuthModule, 
  ],
  providers: [TenantService,ChatService],
  controllers: [TenantController, PublicTenantController], 
  exports: [MongooseModule,ChatService],
})
export class TenantModule {}
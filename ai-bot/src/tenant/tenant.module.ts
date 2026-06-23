import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TenantService } from './tenant.service';
import { TenantController, PublicTenantController } from './tenant.controller';
import { Tenant, TenantSchema } from './tenant.schema';
import { UserModule } from '../user/user.module';
import { AuthModule } from 'src/auth/auth.module';
// 🎯 IMPORT THE PARENT MODULE INSTEAD OF JUST THE SERVICE
import { AiAgentModule } from 'src/ai-agent/ai-agent.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tenant.name, schema: TenantSchema }]),
    UserModule,
    AuthModule,
    forwardRef(() => AiAgentModule), // 🚀 Wrap with forwardRef here as well!
  ],
  providers: [TenantService], // 🧼 Clean out ChatService from here
  controllers: [TenantController, PublicTenantController],
  exports: [MongooseModule, TenantService],
})
export class TenantModule {}

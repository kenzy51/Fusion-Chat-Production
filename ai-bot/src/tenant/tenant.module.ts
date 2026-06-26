// backend/src/tenant/tenant.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TenantController, PublicTenantController } from './tenant.controller';
import { TenantService } from './tenant.service'; 
import { ChatService } from 'src/ai-agent/gemini/chat.service';
import { SessionsService } from 'src/sessions/session.service';

import { Tenant, TenantSchema } from './tenant.schema';
import { User, UserSchema } from 'src/user/user.schema';
import { ChatSession, ChatSessionSchema } from 'src/sessions/schemas/session.schema'; 

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Tenant.name, schema: TenantSchema },
      { name: User.name, schema: UserSchema },
      { name: ChatSession.name, schema: ChatSessionSchema },
    ]),
  ],
  controllers: [
    TenantController,
    PublicTenantController,
  ],
  providers: [
    TenantService,
    ChatService,
    SessionsService,
  ],
  exports: [MongooseModule],
})
export class TenantModule {}
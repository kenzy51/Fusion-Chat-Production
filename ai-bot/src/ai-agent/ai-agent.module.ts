import { forwardRef, Module } from '@nestjs/common';
import { SessionsModule } from 'src/sessions/session.module'; // Make sure path points to your new sessions module
import { ConfigStore } from './config/config';
import { ChatGateway } from './chat/chat.gateway';
import { ChatService } from './gemini/chat.service';
import { TenantModule } from 'src/tenant/tenant.module'; // 🚀 1. IMPORT TENANT MODULE HERE

@Module({
  imports: [
    forwardRef(() => SessionsModule),
    TenantModule, 
  ],
  providers: [ChatService, ChatGateway, ConfigStore],
  exports: [ChatService, ConfigStore],
})
export class AiAgentModule {}
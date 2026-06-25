// backend/src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';

// Services, Controllers & Gateways Built in Prior Ingress Refactors
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatsController } from './chats/chats.controller';
import { TenantController, PublicTenantController } from './tenant/tenant.controller'; // 🚀 FIXED: Imported your dashboard and widget controller modules
import { ChatService } from './ai-agent/gemini/chat.service'; // 🚀 FIXED: Injected optimized Groq / Mongo inference service
import { ChatGateway } from './ai-agent/chat/chat.gateway';// 🚀 FIXED: Connected the low-latency WebSocket layer
import { SessionsService } from './sessions/session.service'; // 🚀 FIXED: Connected persistent analytical tracer

// Isolated Multi-Tenant Schema Registrations
import { Tenant, TenantSchema } from './tenant/tenant.schema';
import { User, UserSchema } from './user/user.schema';
import { ChatSession, ChatSessionSchema } from './sessions/schemas/session.schema';

// Standard Internal Architectural Modules
import { AiAgentModule } from './ai-agent/ai-agent.module';
import { TenantModule } from './tenant/tenant.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { SessionsModule } from './sessions/session.module';

@Module({
  imports: [
    // Global Env configuration loader engine
    ConfigModule.forRoot({ isGlobal: true }),

    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'FUSION_SECURE_MATRIX_KEY',
      signOptions: { expiresIn: '7d' },
    }),

    // Multi-tenant core persistent schema connection pipelines
    MongooseModule.forRoot(process.env.MONGODB_URI!, {
      family: 4,
      serverSelectionTimeoutMS: 5000, 
    }),
    MongooseModule.forFeature([
      { name: Tenant.name, schema: TenantSchema },
      { name: User.name, schema: UserSchema },
      { name: ChatSession.name, schema: ChatSessionSchema },
    ]),

    // Application Sub-Modules
    AiAgentModule,
    SessionsModule,
    TenantModule,
    UserModule,
    AuthModule,
  ],
  controllers: [
    AppController,
    ChatsController,
    TenantController,       // 🔒 FIXED: Handshakes private settings dashboard controls
    PublicTenantController, // 🌐 FIXED: Hooks up client public widgets
  ],
  providers: [
    AppService,
    ChatService,          
    ChatGateway,           
    SessionsService,       
  ],
})
export class AppModule {}
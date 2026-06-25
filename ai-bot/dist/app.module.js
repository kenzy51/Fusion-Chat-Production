"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const jwt_1 = require("@nestjs/jwt");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const chats_controller_1 = require("./chats/chats.controller");
const tenant_controller_1 = require("./tenant/tenant.controller");
const chat_service_1 = require("./ai-agent/gemini/chat.service");
const chat_gateway_1 = require("./ai-agent/chat/chat.gateway");
const session_service_1 = require("./sessions/session.service");
const tenant_schema_1 = require("./tenant/tenant.schema");
const user_schema_1 = require("./user/user.schema");
const session_schema_1 = require("./sessions/schemas/session.schema");
const ai_agent_module_1 = require("./ai-agent/ai-agent.module");
const tenant_module_1 = require("./tenant/tenant.module");
const user_module_1 = require("./user/user.module");
const auth_module_1 = require("./auth/auth.module");
const session_module_1 = require("./sessions/session.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            jwt_1.JwtModule.register({
                global: true,
                secret: process.env.JWT_SECRET || 'FUSION_SECURE_MATRIX_KEY',
                signOptions: { expiresIn: '7d' },
            }),
            mongoose_1.MongooseModule.forRoot(process.env.MONGODB_URI, {
                family: 4,
                serverSelectionTimeoutMS: 5000,
            }),
            mongoose_1.MongooseModule.forFeature([
                { name: tenant_schema_1.Tenant.name, schema: tenant_schema_1.TenantSchema },
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
                { name: session_schema_1.ChatSession.name, schema: session_schema_1.ChatSessionSchema },
            ]),
            ai_agent_module_1.AiAgentModule,
            session_module_1.SessionsModule,
            tenant_module_1.TenantModule,
            user_module_1.UserModule,
            auth_module_1.AuthModule,
        ],
        controllers: [
            app_controller_1.AppController,
            chats_controller_1.ChatsController,
            tenant_controller_1.TenantController,
            tenant_controller_1.PublicTenantController,
        ],
        providers: [
            app_service_1.AppService,
            chat_service_1.ChatService,
            chat_gateway_1.ChatGateway,
            session_service_1.SessionsService,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const groq_sdk_1 = __importDefault(require("groq-sdk"));
const mail_1 = __importDefault(require("@sendgrid/mail"));
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const tenant_schema_1 = require("../../tenant/tenant.schema");
const session_schema_1 = require("../../sessions/schemas/session.schema");
const session_service_1 = require("../../sessions/session.service");
const ioredis_1 = __importDefault(require("ioredis"));
let ChatService = class ChatService {
    sessionsService;
    tenantModel;
    sessionModel;
    groq;
    redis;
    constructor(sessionsService, tenantModel, sessionModel) {
        this.sessionsService = sessionsService;
        this.tenantModel = tenantModel;
        this.sessionModel = sessionModel;
        mail_1.default.setApiKey(process.env.SENDGRID_API_KEY);
        this.groq = new groq_sdk_1.default({ apiKey: process.env.GROQ_API_KEY });
        this.redis = new ioredis_1.default(process.env.REDIS_URL || 'redis://127.0.0.1:6379');
    }
    async onModuleInit() {
        console.log('🚀 Fusion Chat Engine Activated. Stateless Tenancy Engaged.');
    }
    async generateTextOnlyResponse(userText, passedHistory, businessId) {
        const leanHistory = passedHistory.slice(-10);
        try {
            const cacheKey = `tenant:${businessId}:config`;
            let tenantConfigString = await this.redis.get(cacheKey);
            let currentTenant;
            if (tenantConfigString) {
                currentTenant = JSON.parse(tenantConfigString);
            }
            else {
                currentTenant = await this.tenantModel
                    .findOne({
                    $or: [{ _id: businessId }, { slug: businessId }],
                })
                    .exec();
                if (!currentTenant) {
                    return 'System error: Tenant configuration node not found.';
                }
                await this.redis.set(cacheKey, JSON.stringify(currentTenant), 'EX', 300);
            }
            const dynamicKnowledge = currentTenant.voiceConfig?.knowledgeBase || '';
            const dynamicSystemChatPrompt = currentTenant.voiceConfig?.chatPrompt || 'You are a helpful assistant.';
            const response = await this.groq.chat.completions.create({
                model: 'llama-3.1-8b-instant',
                messages: [
                    {
                        role: 'system',
                        content: `${dynamicSystemChatPrompt}\n\n# KNOWLEDGE BASE\n${dynamicKnowledge}\n`,
                    },
                    ...leanHistory,
                    { role: 'user', content: userText },
                ],
                temperature: 0.5,
            });
            return (response.choices[0]?.message?.content ||
                "I'm sorry, I couldn't process that response.");
        }
        catch (err) {
            console.error('❌ Groq Dynamic Multi-Tenant Chat Error:', err);
            return "I'm having trouble connecting to the systems database. Please try again in a moment.";
        }
    }
    async getTenantConfig(tenantId) {
        const cacheKey = `tenant:${tenantId}:config`;
        const cached = await this.redis.get(cacheKey);
        if (cached)
            return JSON.parse(cached);
        const tenant = await this.tenantModel.findById(tenantId).exec();
        if (tenant) {
            await this.redis.set(cacheKey, JSON.stringify(tenant), 'EX', 300);
        }
        return tenant;
    }
    async logSessionToDatabase(conversationId, history, tenantId) {
        try {
            let summary = 'Chat Inquiry';
            if (history.length >= 2) {
                const sumResp = await this.groq.chat.completions.create({
                    model: 'llama-3.1-8b-instant',
                    messages: [
                        {
                            role: 'system',
                            content: 'Summarize this conversation context in one brief sentence.',
                        },
                        {
                            role: 'user',
                            content: history.map((h) => `${h.role}: ${h.content}`).join('\n'),
                        },
                    ],
                });
                summary = sumResp.choices[0]?.message?.content || summary;
            }
            await this.sessionsService.saveSession({
                tenantId,
                sessionId: conversationId,
                endUserIp: 'Web Chat End User',
                summary,
                transcript: history.map((h) => `${h.role}: ${h.content}`).join('\n'),
                status: 'completed',
            });
            console.log(`✅ Multi-Tenant Chat Session saved securely for tenant: ${tenantId}`);
        }
        catch (e) {
            console.error('❌ Async Chat Session Save failed:', e.message);
        }
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, mongoose_1.InjectModel)(tenant_schema_1.Tenant.name)),
    __param(2, (0, mongoose_1.InjectModel)(session_schema_1.ChatSession.name)),
    __metadata("design:paramtypes", [session_service_1.SessionsService,
        mongoose_2.Model,
        mongoose_2.Model])
], ChatService);
//# sourceMappingURL=chat.service.js.map
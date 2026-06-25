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
let ChatService = class ChatService {
    sessionsService;
    tenantModel;
    sessionModel;
    groq;
    constructor(sessionsService, tenantModel, sessionModel) {
        this.sessionsService = sessionsService;
        this.tenantModel = tenantModel;
        this.sessionModel = sessionModel;
        mail_1.default.setApiKey(process.env.SENDGRID_API_KEY);
        this.groq = new groq_sdk_1.default({ apiKey: process.env.GROQ_API_KEY });
    }
    async onModuleInit() {
        console.log('🚀 Fusion Chat Engine Activated. Database Tenancy Bound.');
    }
    async recordFormAction(businessId, conversationId, formData) {
        const leadData = formData || {};
        const status = formData?.fullName && (formData.phone || formData.email) ? 'qualified' : 'anonymous';
        const isObjectId = mongoose_2.Types.ObjectId.isValid(businessId);
        const tenantFilter = isObjectId
            ? { _id: businessId }
            : { slug: { $regex: new RegExp(`^${businessId.trim()}$`, 'i') } };
        const currentTenant = await this.tenantModel.findOne(tenantFilter).exec();
        const tenantSlug = currentTenant ? currentTenant.slug : businessId;
        return await this.sessionModel.findOneAndUpdate({ sessionId: conversationId }, {
            $set: {
                tenantId: currentTenant?._id || null,
                tenantSlug,
                leadMetadata: {
                    fullName: leadData.fullName || null,
                    phone: leadData.phone || null,
                    email: leadData.email || null,
                    capturedStatus: status,
                },
            },
        }, { upsert: true, returnDocument: 'after' });
    }
    async generateTextOnlyResponse(userText, passedHistory, businessId, conversationId) {
        const leanHistory = passedHistory.slice(-10);
        try {
            const isObjectId = mongoose_2.Types.ObjectId.isValid(businessId);
            const tenantFilter = isObjectId
                ? { _id: businessId }
                : { slug: { $regex: new RegExp(`^${businessId.trim()}$`, 'i') } };
            const currentTenant = await this.tenantModel.findOne(tenantFilter).exec();
            if (!currentTenant) {
                return 'System error: Tenant configuration node not found.';
            }
            const dynamicKnowledge = currentTenant.chatConfig?.knowledgeBase || '';
            const dynamicSystemChatPrompt = currentTenant.chatConfig?.chatPrompt || 'You are a helpful assistant.';
            const tenantSlug = currentTenant.slug || businessId;
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
            const aiReply = response.choices[0]?.message?.content || "I'm sorry, I couldn't process that response.";
            await this.sessionModel.findOneAndUpdate({ sessionId: conversationId }, {
                $setOnInsert: {
                    tenantId: currentTenant._id,
                    tenantSlug: tenantSlug,
                    'leadMetadata.capturedStatus': 'anonymous',
                    'leadMetadata.fullName': null,
                    'leadMetadata.phone': null,
                    'leadMetadata.email': null,
                    status: 'active',
                },
                $push: {
                    messages: {
                        $each: [
                            { role: 'user', content: userText, timestamp: new Date() },
                            { role: 'assistant', content: aiReply, timestamp: new Date() },
                        ],
                    },
                },
            }, { upsert: true, returnDocument: 'after' });
            if (userText.toLowerCase().includes('book') || aiReply.includes('/contact')) {
                const structuralFullHistory = [
                    ...passedHistory,
                    { role: 'user', content: userText },
                    { role: 'assistant', content: aiReply }
                ];
                this.logSessionToDatabase(conversationId, structuralFullHistory, currentTenant._id.toString()).catch((err) => console.error('Out-of-band transcription trace save stall error:', err));
            }
            return aiReply;
        }
        catch (err) {
            console.error('❌ Groq Dynamic Multi-Tenant Chat Error:', err);
            return "I'm having trouble connecting to the systems database. Please try again in a moment.";
        }
    }
    async getTenantConfig(tenantId) {
        const isObjectId = mongoose_2.Types.ObjectId.isValid(tenantId);
        const filter = isObjectId ? { _id: tenantId } : { slug: tenantId };
        return await this.tenantModel.findOne(filter).exec();
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
                            content: 'Summarize this conversation context in one brief professional executive summary sentence.',
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
            await this.sessionModel.updateOne({ sessionId: conversationId }, { $set: { aiSummary: summary, isArchived: true, status: 'completed' } });
            console.log(`✅ Multi-Tenant Chat Session saved and summarized securely for tenant: ${tenantId}`);
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
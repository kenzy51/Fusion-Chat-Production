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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantController = exports.PublicTenantController = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const tenant_schema_1 = require("./tenant.schema");
const user_schema_1 = require("../user/user.schema");
const jwt_1 = require("@nestjs/jwt");
const chat_service_1 = require("../ai-agent/gemini/chat.service");
let PublicTenantController = class PublicTenantController {
    tenantModel;
    chatService;
    constructor(tenantModel, chatService) {
        this.tenantModel = tenantModel;
        this.chatService = chatService;
    }
    async getPublicWidgetConfig(slug) {
        if (!slug || slug === 'undefined' || slug === 'workspace') {
            throw new common_1.BadRequestException('Workspace tracking parameters invalid.');
        }
        const tenant = await this.tenantModel
            .findOne({ slug: { $regex: new RegExp(`^${slug.trim()}$`, 'i') } })
            .lean()
            .exec();
        if (!tenant) {
            return {
                name: 'AI Support Node',
                slug: slug.toLowerCase().trim(),
                primaryColor: '#d4ff33',
                backgroundColor: '#0a0a0a',
                textColor: '#ffffff',
                widgetTitle: 'AI Support Assistant',
                greeting: 'Hello! Setting up configurations. How can I help you today?',
                knowledgeBase: '',
                chatPrompt: '',
                leadFormPolicy: 'optional',
            };
        }
        return {
            name: tenant.name,
            slug: tenant.slug,
            primaryColor: tenant.chatConfig?.primaryColor || '#d4ff33',
            backgroundColor: tenant.chatConfig?.backgroundColor || '#0a0a0a',
            textColor: tenant.chatConfig?.textColor || '#ffffff',
            widgetTitle: tenant.chatConfig?.widgetTitle || 'AI Assistant',
            greeting: tenant.chatConfig?.greeting || 'Hello!',
            knowledgeBase: tenant.chatConfig?.knowledgeBase || '',
            chatPrompt: tenant.chatConfig?.chatPrompt || '',
            leadFormPolicy: tenant.chatConfig?.leadFormPolicy || 'optional',
        };
    }
    async initializeLead(tenantSlug, conversationId, formData) {
        if (!tenantSlug || !conversationId) {
            throw new common_1.BadRequestException('Initialization transaction rejected: Missing critical tracking parameters.');
        }
        return await this.chatService.recordFormAction(tenantSlug, conversationId, formData);
    }
    async handleIncomingWidgetMessage(body) {
        const { message, slug, conversationId, history } = body;
        if (!slug || !conversationId) {
            throw new common_1.BadRequestException('Cannot initiate matrix lookup: Missing tenant validation tokens.');
        }
        const tenant = await this.tenantModel
            .findOne({ slug: { $regex: new RegExp(`^${slug.trim()}$`, 'i') } })
            .lean()
            .exec();
        if (!tenant) {
            throw new common_1.NotFoundException('The requested business profile workspace does not exist.');
        }
        try {
            const passedHistoryArray = history || [];
            const aiReply = await this.chatService.generateTextOnlyResponse(message, passedHistoryArray, tenant._id.toString(), conversationId);
            return {
                reply: aiReply,
                conversationId,
            };
        }
        catch (error) {
            console.error('Public UI Widget Inference pipeline crash:', error);
            return {
                reply: "I'm having trouble connecting to my systems array right now. Please try again shortly!",
                conversationId,
            };
        }
    }
};
exports.PublicTenantController = PublicTenantController;
__decorate([
    (0, common_1.Get)(':slug/widget-config'),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PublicTenantController.prototype, "getPublicWidgetConfig", null);
__decorate([
    (0, common_1.Post)('initialize-lead'),
    __param(0, (0, common_1.Body)('tenantSlug')),
    __param(1, (0, common_1.Body)('conversationId')),
    __param(2, (0, common_1.Body)('formData')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], PublicTenantController.prototype, "initializeLead", null);
__decorate([
    (0, common_1.Post)('message'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PublicTenantController.prototype, "handleIncomingWidgetMessage", null);
exports.PublicTenantController = PublicTenantController = __decorate([
    (0, common_1.Controller)('public-tenant'),
    __param(0, (0, mongoose_1.InjectModel)(tenant_schema_1.Tenant.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        chat_service_1.ChatService])
], PublicTenantController);
let TenantController = class TenantController {
    tenantModel;
    userModel;
    jwtService;
    constructor(tenantModel, userModel, jwtService) {
        this.tenantModel = tenantModel;
        this.userModel = userModel;
        this.jwtService = jwtService;
    }
    decodeHeaderToken(authHeader) {
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new common_1.BadRequestException('Administrative active session missing.');
        }
        const token = authHeader.split(' ')[1];
        const decoded = this.jwtService.decode(token);
        if (!decoded || !decoded.tenantId || !decoded.sub) {
            throw new common_1.BadRequestException('Security credential token fingerprint corrupt.');
        }
        return decoded;
    }
    async getCombinedProfile(authHeader) {
        const decoded = this.decodeHeaderToken(authHeader);
        const [tenant, user] = await Promise.all([
            this.tenantModel.findById(decoded.tenantId).lean().exec(),
            this.userModel.findById(decoded.sub).lean().exec(),
        ]);
        if (!tenant) {
            const fallbackTenant = await this.tenantModel.findOne({}).lean().exec();
            return {
                id: fallbackTenant?._id || 'mock_tenant_id',
                name: fallbackTenant?.name || 'Fusion Space (Failsafe)',
                slug: fallbackTenant?.slug || 'test',
                chatConfig: fallbackTenant?.chatConfig || {},
                user: {
                    name: user?.name || 'Test User (No DB Match)',
                    email: user?.email || 'test@gmail.com',
                    role: user?.role || 'admin',
                },
            };
        }
        return {
            id: tenant._id,
            name: tenant.name,
            slug: tenant.slug,
            chatConfig: {
                ...tenant.chatConfig,
                leadFormPolicy: tenant.chatConfig?.leadFormPolicy || 'optional',
            },
            user: {
                name: user?.name || 'Admin Node',
                email: user?.email || decoded.email || 'unknown@gmail.com',
                role: user?.role || decoded.role || 'admin',
            },
        };
    }
    async updateConfig(authHeader, body) {
        const decoded = this.decodeHeaderToken(authHeader);
        const { chatConfig } = body;
        const updatedTenant = await this.tenantModel
            .findByIdAndUpdate(decoded.tenantId, {
            $set: {
                'chatConfig.knowledgeBase': chatConfig.knowledgeBase,
                'chatConfig.chatPrompt': chatConfig.chatPrompt,
                'chatConfig.greeting': chatConfig.greeting,
                'chatConfig.primaryColor': chatConfig.primaryColor,
                'chatConfig.backgroundColor': chatConfig.backgroundColor,
                'chatConfig.textColor': chatConfig.textColor,
                'chatConfig.widgetTitle': chatConfig.widgetTitle,
                'chatConfig.leadFormPolicy': chatConfig.leadFormPolicy || 'optional',
            },
        }, { new: true })
            .lean()
            .exec();
        return {
            success: true,
            message: 'Workspace branding parameters successfully synchronized.',
            chatConfig: updatedTenant.chatConfig,
        };
    }
};
exports.TenantController = TenantController;
__decorate([
    (0, common_1.Get)('config'),
    __param(0, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TenantController.prototype, "getCombinedProfile", null);
__decorate([
    (0, common_1.Patch)('update-config'),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TenantController.prototype, "updateConfig", null);
exports.TenantController = TenantController = __decorate([
    (0, common_1.Controller)('tenant'),
    __param(0, (0, mongoose_1.InjectModel)(tenant_schema_1.Tenant.name)),
    __param(1, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        jwt_1.JwtService])
], TenantController);
//# sourceMappingURL=tenant.controller.js.map
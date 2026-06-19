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
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const user_schema_1 = require("../user/user.schema");
const tenant_schema_1 = require("./tenant.schema");
const common_2 = require("@nestjs/common");
const groq_sdk_1 = require("groq-sdk");
const groq = new groq_sdk_1.Groq();
let PublicTenantController = class PublicTenantController {
    tenantModel;
    constructor(tenantModel) {
        this.tenantModel = tenantModel;
    }
    async publicWidgetMessage(body) {
        const { message, slug } = body;
        const tenant = await this.tenantModel.findOne({ slug }).lean().exec();
        if (!tenant) {
            throw new common_2.NotFoundException('Inbound routing identifier node mismatch.');
        }
        try {
            const systemInstruction = `
        ${tenant.chatConfig?.chatPrompt || 'You are a helpful assistant.'}
        Use ONLY the following knowledge facts context to answer:
        ${tenant.chatConfig?.knowledgeBase || ''}
      `;
            const chatCompletion = await groq.chat.completions.create({
                messages: [
                    { role: 'system', content: systemInstruction },
                    { role: 'user', content: message },
                ],
                model: 'llama-3.1-8b-instant',
                temperature: 0.2,
                max_tokens: 512,
            });
            return {
                reply: chatCompletion.choices[0]?.message?.content ||
                    'Connection timeout stream anomaly.',
            };
        }
        catch (error) {
            return { reply: 'Engine down. Please try again later.' };
        }
    }
    async getPublicWidgetConfig(slug) {
        const tenant = await this.tenantModel.findOne({ slug }).lean().exec();
        if (!tenant) {
            throw new common_2.NotFoundException('Target infrastructure context not located.');
        }
        return {
            name: tenant.name,
            slug: tenant.slug,
            primaryColor: tenant.chatConfig?.primaryColor || '#d4ff33',
            backgroundColor: tenant.chatConfig?.backgroundColor || '#000000',
            textColor: tenant.chatConfig?.textColor || '#ffffff',
            widgetTitle: tenant.chatConfig?.widgetTitle || 'AI Assistant',
            greeting: tenant.chatConfig?.greeting || 'Hello!',
            logoUrl: tenant.chatConfig?.logoUrl || '',
        };
    }
};
exports.PublicTenantController = PublicTenantController;
__decorate([
    (0, common_1.Post)('message'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PublicTenantController.prototype, "publicWidgetMessage", null);
__decorate([
    (0, common_1.Get)(':slug/widget-config'),
    __param(0, (0, common_2.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PublicTenantController.prototype, "getPublicWidgetConfig", null);
exports.PublicTenantController = PublicTenantController = __decorate([
    (0, common_1.Controller)('public-tenant'),
    __param(0, (0, mongoose_1.InjectModel)(tenant_schema_1.Tenant.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], PublicTenantController);
let TenantController = class TenantController {
    tenantModel;
    userModel;
    constructor(tenantModel, userModel) {
        this.tenantModel = tenantModel;
        this.userModel = userModel;
    }
    async getCombinedProfile(req) {
        if (!req.user) {
            throw new common_1.UnauthorizedException('Authentication footprint context missing.');
        }
        const { userId, tenantId } = req.user;
        const [tenant, user] = await Promise.all([
            this.tenantModel.findById(tenantId).lean().exec(),
            this.userModel.findById(userId).lean().exec(),
        ]);
        if (!tenant || !user) {
            return {
                name: 'Fusion Space',
                chatConfig: {},
                user: { name: 'Admin Node', email: '' },
            };
        }
        return {
            id: tenant._id,
            name: tenant.name,
            chatConfig: tenant.chatConfig,
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
            },
        };
    }
    async updateConfig(req, body) {
        if (!req.user) {
            throw new common_1.UnauthorizedException('Action rejected: Active workspace session state is invalid or expired. Please re-login.');
        }
        const { tenantId } = req.user;
        const { chatConfig } = body;
        if (!tenantId) {
            throw new common_1.BadRequestException('Context verification failure: Missing explicit tenant identity anchor.');
        }
        const updatedTenant = await this.tenantModel
            .findByIdAndUpdate(tenantId, {
            $set: {
                'chatConfig.knowledgeBase': chatConfig.knowledgeBase,
                'chatConfig.chatPrompt': chatConfig.chatPrompt,
                'chatConfig.greeting': chatConfig.greeting,
                'chatConfig.primaryColor': chatConfig.primaryColor,
                'chatConfig.backgroundColor': chatConfig.backgroundColor,
                'chatConfig.textColor': chatConfig.textColor,
                'chatConfig.widgetTitle': chatConfig.widgetTitle,
            },
        }, { new: true })
            .lean()
            .exec();
        if (!updatedTenant) {
            throw new common_2.NotFoundException('Failed to update: Tenant structure not located.');
        }
        return {
            success: true,
            message: 'Neural brand metrics safely synchronized.',
            chatConfig: updatedTenant.chatConfig,
        };
    }
};
exports.TenantController = TenantController;
__decorate([
    (0, common_1.Get)('config'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TenantController.prototype, "getCombinedProfile", null);
__decorate([
    (0, common_1.Patch)('update-config'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TenantController.prototype, "updateConfig", null);
exports.TenantController = TenantController = __decorate([
    (0, common_1.Controller)('tenant'),
    __param(0, (0, mongoose_1.InjectModel)(tenant_schema_1.Tenant.name)),
    __param(1, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], TenantController);
//# sourceMappingURL=tenant.controller.js.map
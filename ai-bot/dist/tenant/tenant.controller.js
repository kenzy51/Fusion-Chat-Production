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
const user_schema_1 = require("../user/user.schema");
const tenant_schema_1 = require("./tenant.schema");
const common_2 = require("@nestjs/common");
let PublicTenantController = class PublicTenantController {
    tenantModel;
    constructor(tenantModel) {
        this.tenantModel = tenantModel;
    }
    async getPublicWidgetConfig(slug) {
        let tenant = null;
        if (slug && slug !== 'workspace' && slug !== 'undefined') {
            tenant = await this.tenantModel
                .findOne({ slug: { $regex: new RegExp(`^${slug.trim()}$`, 'i') } })
                .lean()
                .exec();
        }
        if (!tenant) {
            tenant = await this.tenantModel.findOne({}).sort({ createdAt: -1 }).lean().exec();
        }
        if (!tenant) {
            throw new common_1.NotFoundException('Configuration sync error: No tenant entries exist in the MongoDB collection yet.');
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
            logoUrl: tenant.chatConfig?.logoUrl || '',
        };
    }
};
exports.PublicTenantController = PublicTenantController;
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
        const tenant = await this.tenantModel.findOne({}).sort({ createdAt: -1 }).lean().exec();
        return {
            id: tenant?._id || 'mock_id',
            name: tenant?.name || 'Fusion Space',
            chatConfig: tenant?.chatConfig || {},
            user: { name: 'Admin Node', email: 'admin@fusion.ai', role: 'admin' },
        };
    }
    async updateConfig(req, body) {
        const { chatConfig, slug } = body;
        let updatedTenant = null;
        if (slug && slug !== 'workspace' && slug !== 'undefined') {
            updatedTenant = await this.tenantModel
                .findOneAndUpdate({ slug: { $regex: new RegExp(`^${slug.trim()}$`, 'i') } }, {
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
        }
        if (!updatedTenant) {
            const activeDocument = await this.tenantModel.findOne({}).sort({ createdAt: -1 }).exec();
            if (activeDocument) {
                updatedTenant = await this.tenantModel
                    .findByIdAndUpdate(activeDocument._id, {
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
            }
        }
        if (!updatedTenant) {
            throw new common_1.NotFoundException('Failed to execute update: Target document cannot be located inside collections.');
        }
        return {
            success: true,
            message: 'Neural brand metrics safely synchronized to current active workspace document.',
            chatConfig: updatedTenant.chatConfig,
        };
    }
};
exports.TenantController = TenantController;
__decorate([
    (0, common_1.Get)('config'),
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
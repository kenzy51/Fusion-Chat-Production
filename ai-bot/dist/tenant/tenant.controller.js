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
exports.TenantController = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const user_schema_1 = require("../user/user.schema");
const tenant_schema_1 = require("./tenant.schema");
let TenantController = class TenantController {
    tenantModel;
    userModel;
    constructor(tenantModel, userModel) {
        this.tenantModel = tenantModel;
        this.userModel = userModel;
    }
    async getCombinedProfile(req) {
        const { userId, tenantId } = req.user;
        const [tenant, user] = await Promise.all([
            this.tenantModel.findById(tenantId).lean().exec(),
            this.userModel.findById(userId).lean().exec(),
        ]);
        if (!tenant || !user) {
            return { name: 'Fusion Space', chatConfig: {}, user: { name: 'Admin Node', email: '' } };
        }
        return {
            id: tenant._id,
            name: tenant.name,
            chatConfig: tenant.chatConfig,
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
            }
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
exports.TenantController = TenantController = __decorate([
    (0, common_1.Controller)('tenant'),
    __param(0, (0, mongoose_1.InjectModel)(tenant_schema_1.Tenant.name)),
    __param(1, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], TenantController);
//# sourceMappingURL=tenant.controller.js.map
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const auth_service_1 = require("./auth.service");
const user_schema_1 = require("../user/user.schema");
const tenant_schema_1 = require("../tenant/tenant.schema");
const email_service_1 = require("./email.service");
const crypto = __importStar(require("crypto"));
const bcrypt = __importStar(require("bcrypt"));
let AuthController = class AuthController {
    authService;
    userService;
    tenantService;
    emailService;
    constructor(authService, userService, tenantService, emailService) {
        this.authService = authService;
        this.userService = userService;
        this.tenantService = tenantService;
        this.emailService = emailService;
    }
    async register(registerDto) {
        console.log(`🚀 Received self-service registration request for: ${registerDto.businessName}`);
        return this.authService.registerTenantAccount(registerDto);
    }
    async login(loginDto) {
        return this.authService.login(loginDto);
    }
    async verifyEmail(token) {
        if (!token) {
            throw new common_1.BadRequestException('Verification token context missing.');
        }
        const user = await this.userService.findOne({
            emailVerificationToken: token,
        });
        if (!user) {
            throw new common_1.BadRequestException('Token invalid or expired.');
        }
        user.isEmailVerified = true;
        user.emailVerificationToken = undefined;
        await user.save();
        return {
            success: true,
            message: 'Node identity successfully verified. You may now login.',
        };
    }
    async forgotPassword(email) {
        const user = await this.userService.findOne({ email });
        if (!user) {
            throw new common_1.NotFoundException('No active account associated with that email.');
        }
        const token = crypto.randomBytes(32).toString('hex');
        user.passwordResetToken = token;
        user.passwordResetExpires = new Date(Date.now() + 3600000);
        await user.save();
        await this.emailService.sendResetPasswordEmail(user.email, token);
        return {
            success: true,
            message: 'Recovery pipeline transmission delivered to input address.',
        };
    }
    async resetPassword(body) {
        const { token, newPassword } = body;
        const user = await this.userService.findOne({
            passwordResetToken: token,
            passwordResetExpires: { $gt: new Date() },
        });
        if (!user) {
            throw new common_1.BadRequestException('Reset window token is invalid or has expired.');
        }
        user.password = await bcrypt.hash(newPassword, 10);
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();
        return {
            success: true,
            message: 'Account access credential recalibrated successfully.',
        };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('verify-email'),
    __param(0, (0, common_1.Query)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyEmail", null);
__decorate([
    (0, common_1.Post)('forgot-password'),
    __param(0, (0, common_1.Body)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)('reset-password'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __param(1, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(2, (0, mongoose_1.InjectModel)(tenant_schema_1.Tenant.name)),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        mongoose_2.Model,
        mongoose_2.Model,
        email_service_1.EmailService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map
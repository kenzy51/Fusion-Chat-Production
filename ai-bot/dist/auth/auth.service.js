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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../user/user.schema");
const tenant_schema_1 = require("../tenant/tenant.schema");
const bcrypt = __importStar(require("bcrypt"));
const jwt_1 = require("@nestjs/jwt");
let AuthService = class AuthService {
    userModel;
    tenantModel;
    jwtService;
    constructor(userModel, tenantModel, jwtService) {
        this.userModel = userModel;
        this.tenantModel = tenantModel;
        this.jwtService = jwtService;
    }
    async registerTenantAccount(dto) {
        const existingUser = await this.userModel
            .findOne({ email: dto.email })
            .exec();
        if (existingUser) {
            throw new common_1.BadRequestException('This email is already associated with an account.');
        }
        const session = await this.userModel.db.startSession();
        session.startTransaction();
        try {
            const newTenant = new this.tenantModel({
                name: dto.businessName,
                slug: dto.businessName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
                chatConfig: {},
            });
            const savedTenant = await newTenant.save({ session });
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(dto.password, salt);
            const newUser = new this.userModel({
                name: dto.name,
                email: dto.email,
                passwordHash,
                tenantId: savedTenant._id,
                role: 'admin',
            });
            await newUser.save({ session });
            await session.commitTransaction();
            return { status: 'success', tenantId: savedTenant._id };
        }
        catch (error) {
            await session.abortTransaction();
            console.error('❌ Tenant registration rolled back due to error:', error.message);
            throw new common_1.BadRequestException('Workspace provisioning aborted due to an internal system fault.');
        }
        finally {
            await session.endSession();
        }
    }
    async login(dto) {
        const user = await this.userModel.findOne({ email: dto.email }).exec();
        if (!user)
            throw new common_1.BadRequestException('Invalid credentials.');
        const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
        if (!isMatch)
            throw new common_1.BadRequestException('Invalid credentials.');
        const payload = {
            sub: user._id,
            email: user.email,
            tenantId: user.tenantId,
            role: user.role,
        };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(tenant_schema_1.Tenant.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map
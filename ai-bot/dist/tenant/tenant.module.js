"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const tenant_controller_1 = require("./tenant.controller");
const tenant_service_1 = require("./tenant.service");
const chat_service_1 = require("../ai-agent/gemini/chat.service");
const session_service_1 = require("../sessions/session.service");
const tenant_schema_1 = require("./tenant.schema");
const user_schema_1 = require("../user/user.schema");
const session_schema_1 = require("../sessions/schemas/session.schema");
let TenantModule = class TenantModule {
};
exports.TenantModule = TenantModule;
exports.TenantModule = TenantModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: tenant_schema_1.Tenant.name, schema: tenant_schema_1.TenantSchema },
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
                { name: session_schema_1.ChatSession.name, schema: session_schema_1.ChatSessionSchema },
            ]),
        ],
        controllers: [
            tenant_controller_1.TenantController,
            tenant_controller_1.PublicTenantController,
        ],
        providers: [
            tenant_service_1.TenantService,
            chat_service_1.ChatService,
            session_service_1.SessionsService,
        ],
        exports: [mongoose_1.MongooseModule],
    })
], TenantModule);
//# sourceMappingURL=tenant.module.js.map
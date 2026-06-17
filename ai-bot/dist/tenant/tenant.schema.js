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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantSchema = exports.Tenant = exports.ChatConfig = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let ChatConfig = class ChatConfig {
    knowledgeBase;
    chatPrompt;
    greeting;
    primaryColor;
    backgroundColor;
    widgetTitle;
    logoUrl;
};
exports.ChatConfig = ChatConfig;
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], ChatConfig.prototype, "knowledgeBase", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], ChatConfig.prototype, "chatPrompt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'Hello! How can I assist you today?' }),
    __metadata("design:type", String)
], ChatConfig.prototype, "greeting", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '#d4ff33' }),
    __metadata("design:type", String)
], ChatConfig.prototype, "primaryColor", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '#000000' }),
    __metadata("design:type", String)
], ChatConfig.prototype, "backgroundColor", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'Fusion Bot' }),
    __metadata("design:type", String)
], ChatConfig.prototype, "widgetTitle", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], ChatConfig.prototype, "logoUrl", void 0);
exports.ChatConfig = ChatConfig = __decorate([
    (0, mongoose_1.Schema)()
], ChatConfig);
let Tenant = class Tenant extends mongoose_2.Document {
    name;
    slug;
    chatConfig;
};
exports.Tenant = Tenant;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Tenant.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], Tenant.prototype, "slug", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: ChatConfig, default: () => ({}) }),
    __metadata("design:type", ChatConfig)
], Tenant.prototype, "chatConfig", void 0);
exports.Tenant = Tenant = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Tenant);
exports.TenantSchema = mongoose_1.SchemaFactory.createForClass(Tenant);
//# sourceMappingURL=tenant.schema.js.map
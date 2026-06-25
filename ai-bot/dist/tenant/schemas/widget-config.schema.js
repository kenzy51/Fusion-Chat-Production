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
exports.WidgetConfigSchema = exports.WidgetConfig = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let WidgetConfig = class WidgetConfig {
    tenantSlug;
    leadFormPolicy;
    widgetTitle;
    greeting;
    primaryColor;
    backgroundColor;
    textColor;
};
exports.WidgetConfig = WidgetConfig;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], WidgetConfig.prototype, "tenantSlug", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: ['mandatory', 'optional', 'disabled'],
        default: 'optional',
    }),
    __metadata("design:type", String)
], WidgetConfig.prototype, "leadFormPolicy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'AI Assistant' }),
    __metadata("design:type", String)
], WidgetConfig.prototype, "widgetTitle", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'Hello! How can I assist you today?' }),
    __metadata("design:type", String)
], WidgetConfig.prototype, "greeting", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '#d4ff33' }),
    __metadata("design:type", String)
], WidgetConfig.prototype, "primaryColor", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '#0a0a0a' }),
    __metadata("design:type", String)
], WidgetConfig.prototype, "backgroundColor", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '#ffffff' }),
    __metadata("design:type", String)
], WidgetConfig.prototype, "textColor", void 0);
exports.WidgetConfig = WidgetConfig = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], WidgetConfig);
exports.WidgetConfigSchema = mongoose_1.SchemaFactory.createForClass(WidgetConfig);
//# sourceMappingURL=widget-config.schema.js.map
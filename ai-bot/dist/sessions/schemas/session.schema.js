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
exports.ChatSessionSchema = exports.ChatSession = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let ChatSession = class ChatSession {
    tenantId;
    sessionId;
    endUserIp;
    summary;
    transcript;
    status;
    fullName;
    phone;
    email;
    leadMetadata;
};
exports.ChatSession = ChatSession;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ChatSession.prototype, "tenantId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], ChatSession.prototype, "sessionId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'Web Chat End User' }),
    __metadata("design:type", String)
], ChatSession.prototype, "endUserIp", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], ChatSession.prototype, "summary", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], ChatSession.prototype, "transcript", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'active' }),
    __metadata("design:type", String)
], ChatSession.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: null }),
    __metadata("design:type", Object)
], ChatSession.prototype, "fullName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: null }),
    __metadata("design:type", Object)
], ChatSession.prototype, "phone", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: null }),
    __metadata("design:type", Object)
], ChatSession.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            fullName: { type: String, default: null },
            phone: { type: String, default: null },
            email: { type: String, default: null },
            capturedStatus: { type: String, default: 'anonymous' }
        },
        _id: false,
        default: { fullName: null, phone: null, email: null, capturedStatus: 'anonymous' }
    }),
    __metadata("design:type", Object)
], ChatSession.prototype, "leadMetadata", void 0);
exports.ChatSession = ChatSession = __decorate([
    (0, mongoose_1.Schema)({ collection: 'sessions', timestamps: true })
], ChatSession);
exports.ChatSessionSchema = mongoose_1.SchemaFactory.createForClass(ChatSession);
//# sourceMappingURL=session.schema.js.map
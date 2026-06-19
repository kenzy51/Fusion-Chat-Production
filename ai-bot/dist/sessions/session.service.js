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
exports.SessionsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const session_schema_1 = require("./schemas/session.schema");
let SessionsService = class SessionsService {
    sessionModel;
    constructor(sessionModel) {
        this.sessionModel = sessionModel;
    }
    async saveSession(sessionData) {
        return await this.sessionModel
            .findOneAndUpdate({ sessionId: sessionData.sessionId }, { $set: sessionData }, { upsert: true, new: true })
            .exec();
    }
    async getHistoryByTenant(tenantId) {
        return this.sessionModel
            .find({ tenantId })
            .sort({ createdAt: -1 })
            .limit(50)
            .exec();
    }
    async findBySessionId(sessionId) {
        return this.sessionModel
            .findOne({ sessionId })
            .exec();
    }
    async updateStatus(sessionId, status) {
        return this.sessionModel
            .findOneAndUpdate({ sessionId }, { $set: { status } }, { new: true })
            .exec();
    }
    async updateFlagState(sessionId, isFlagged) {
        return this.sessionModel
            .findOneAndUpdate({ sessionId }, { $set: { isFlagged } }, { new: true })
            .exec();
    }
};
exports.SessionsService = SessionsService;
exports.SessionsService = SessionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(session_schema_1.ChatSession.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], SessionsService);
//# sourceMappingURL=session.service.js.map
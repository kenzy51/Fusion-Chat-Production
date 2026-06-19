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
exports.SessionsController = void 0;
const common_1 = require("@nestjs/common");
const session_service_1 = require("./session.service");
let SessionsController = class SessionsController {
    sessionsService;
    constructor(sessionsService) {
        this.sessionsService = sessionsService;
    }
    async getTenantSessions(tenantId) {
        if (!tenantId) {
            throw new common_1.NotFoundException('A valid tenantId query parameter is mandatory.');
        }
        return this.sessionsService.getHistoryByTenant(tenantId);
    }
    async getSessionDetails(sessionId) {
        const session = await this.sessionsService.findBySessionId(sessionId);
        if (!session) {
            throw new common_1.NotFoundException(`Chat session thread [${sessionId}] could not be located.`);
        }
        return session;
    }
    async updateSessionStatus(sessionId, status) {
        const validStatuses = [
            'active',
            'completed',
            'abandoned',
            'human_escalated',
        ];
        if (!validStatuses.includes(status)) {
            throw new common_1.NotFoundException(`Invalid status transition parameter.`);
        }
        const updatedSession = await this.sessionsService.updateStatus(sessionId, status);
        if (!updatedSession) {
            throw new common_1.NotFoundException(`Target session context missing.`);
        }
        return { status: 'success', data: updatedSession };
    }
    async flagSession(sessionId, isFlagged) {
        return this.sessionsService.updateFlagState(sessionId, isFlagged);
    }
};
exports.SessionsController = SessionsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SessionsController.prototype, "getTenantSessions", null);
__decorate([
    (0, common_1.Get)(':sessionId'),
    __param(0, (0, common_1.Param)('sessionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SessionsController.prototype, "getSessionDetails", null);
__decorate([
    (0, common_1.Patch)(':sessionId/status'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('sessionId')),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SessionsController.prototype, "updateSessionStatus", null);
__decorate([
    (0, common_1.Patch)(':sessionId/flag'),
    __param(0, (0, common_1.Param)('sessionId')),
    __param(1, (0, common_1.Body)('isFlagged')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean]),
    __metadata("design:returntype", Promise)
], SessionsController.prototype, "flagSession", null);
exports.SessionsController = SessionsController = __decorate([
    (0, common_1.Controller)('sessions'),
    __metadata("design:paramtypes", [session_service_1.SessionsService])
], SessionsController);
//# sourceMappingURL=session.controller.js.map
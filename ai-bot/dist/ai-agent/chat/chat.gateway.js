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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const chat_service_1 = require("../gemini/chat.service");
const crypto = __importStar(require("crypto"));
let ChatGateway = class ChatGateway {
    chatService;
    constructor(chatService) {
        this.chatService = chatService;
    }
    async handleConnection(client) {
        client.id = crypto.randomUUID();
        console.log(`📡 New Web Chat Socket Connected: ${client.id}`);
        const defaultTestTenantId = "66708b76e1a47b2c93d9ef12";
        const tenantConfig = await this.chatService.getTenantConfig(defaultTestTenantId);
        const greeting = tenantConfig?.voiceConfig?.greeting || "Hello! How can I help you today?";
        client.send(JSON.stringify({
            event: 'session_established',
            sessionId: client.id,
            greeting: greeting
        }));
    }
    async handleMessage(client, payload) {
        const parsed = typeof payload === 'string' ? JSON.parse(payload) : payload;
        const data = parsed.data || parsed;
        const tenantId = data.tenantId;
        const sessionId = data.sessionId || client.id;
        if (!tenantId) {
            client.send(JSON.stringify({ event: 'error', data: 'Missing tenant identifier.' }));
            return;
        }
        const aiResponse = await this.chatService.generateTextOnlyResponse(data.text, data.history || [], tenantId);
        client.send(JSON.stringify({
            event: 'ai_response',
            data: aiResponse
        }));
        const currentMessageWindow = [
            ...(data.history || []),
            { role: 'user', content: data.text },
            { role: 'assistant', content: aiResponse }
        ];
        this.chatService.logSessionToDatabase(sessionId, currentMessageWindow, tenantId)
            .catch(err => console.error(`❌ Delayed DB Session log failed:`, err));
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.SubscribeMessage)('message'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleMessage", null);
exports.ChatGateway = ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ path: '/chat-stream', cors: { origin: '*' } }),
    __metadata("design:paramtypes", [chat_service_1.ChatService])
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map
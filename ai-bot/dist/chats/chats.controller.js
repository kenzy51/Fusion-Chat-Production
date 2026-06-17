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
exports.ChatsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const groq_sdk_1 = require("groq-sdk");
const groq = new groq_sdk_1.Groq();
let ChatsController = class ChatsController {
    async previewMessage(body) {
        const { message, chatPrompt, knowledgeBase } = body;
        try {
            const systemInstruction = `
        ${chatPrompt}

        Use ONLY the following knowledge base data to answer the user's question. 
        If the answer cannot be confidently deduced from the knowledge base below, politely say you don't have that information.

        ---
        KNOWLEDGE BASE CONTEXT:
        ${knowledgeBase}
      `;
            const chatCompletion = await groq.chat.completions.create({
                messages: [
                    { role: 'system', content: systemInstruction },
                    { role: 'user', content: message },
                ],
                model: 'llama-3.1-8b-instant',
                temperature: 0.2,
                max_tokens: 512,
            });
            return {
                reply: chatCompletion.choices[0]?.message?.content || "No matrix data returned from the cluster model node.",
            };
        }
        catch (error) {
            console.error('Groq compilation execution failed:', error);
            return {
                reply: "System pipeline compilation error. Verify your backend GROQ_API_KEY token configuration.",
            };
        }
    }
};
exports.ChatsController = ChatsController;
__decorate([
    (0, common_1.Post)('preview-message'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatsController.prototype, "previewMessage", null);
exports.ChatsController = ChatsController = __decorate([
    (0, common_1.Controller)('chats')
], ChatsController);
//# sourceMappingURL=chats.controller.js.map
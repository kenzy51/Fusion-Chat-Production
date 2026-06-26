import { OnModuleInit } from '@nestjs/common';
import { Model } from 'mongoose';
import { Tenant } from 'src/tenant/tenant.schema';
import { ChatSession as LocalSessionModel } from 'src/sessions/schemas/session.schema';
import { SessionsService } from 'src/sessions/session.service';
export declare class ChatService implements OnModuleInit {
    private readonly sessionsService;
    private readonly tenantModel;
    private readonly sessionModel;
    private groq;
    constructor(sessionsService: SessionsService, tenantModel: Model<Tenant>, sessionModel: Model<LocalSessionModel>);
    onModuleInit(): Promise<void>;
    recordFormAction(businessId: string, conversationId: string, formData?: {
        fullName?: string;
        phone?: string;
        email?: string;
    }): Promise<any>;
    generateTextOnlyResponse(userText: string, passedHistory: any[], businessId: string, conversationId: string): Promise<string>;
    getTenantConfig(tenantId: string): Promise<any>;
    logSessionToDatabase(conversationId: string, history: any[], tenantId: string): Promise<void>;
}

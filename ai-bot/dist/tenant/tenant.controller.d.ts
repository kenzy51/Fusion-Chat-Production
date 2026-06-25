import { Model } from 'mongoose';
import { Tenant } from 'src/tenant/tenant.schema';
import { User } from 'src/user/user.schema';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from 'src/ai-agent/gemini/chat.service';
export declare class PublicTenantController {
    private readonly tenantModel;
    private readonly chatService;
    constructor(tenantModel: Model<Tenant>, chatService: ChatService);
    getPublicWidgetConfig(slug: string): Promise<{
        name: string;
        slug: string;
        primaryColor: string;
        backgroundColor: string;
        textColor: string;
        widgetTitle: string;
        greeting: string;
        knowledgeBase: string;
        chatPrompt: string;
        leadFormPolicy: any;
    }>;
    initializeLead(tenantSlug: string, conversationId: string, formData?: {
        fullName?: string;
        phone?: string;
        email?: string;
    }): Promise<any>;
    handleIncomingWidgetMessage(body: {
        message: string;
        slug: string;
        conversationId: string;
        history?: any[];
    }): Promise<{
        reply: string;
        conversationId: string;
    }>;
}
export declare class TenantController {
    private readonly tenantModel;
    private readonly userModel;
    private readonly jwtService;
    constructor(tenantModel: Model<Tenant>, userModel: Model<User>, jwtService: JwtService);
    private decodeHeaderToken;
    getCombinedProfile(authHeader: string): Promise<{
        id: string | import("mongoose").Types.ObjectId;
        name: string;
        slug: string;
        chatConfig: {};
        user: {
            name: string;
            email: string;
            role: string;
        };
    } | {
        id: import("mongoose").Types.ObjectId;
        name: string;
        slug: string;
        chatConfig: {
            leadFormPolicy: any;
            knowledgeBase: string;
            chatPrompt: string;
            greeting: string;
            primaryColor: string;
            backgroundColor: string;
            widgetTitle: string;
            logoUrl: string;
            textColor: string;
        };
        user: {
            name: string;
            email: any;
            role: any;
        };
    }>;
    updateConfig(authHeader: string, body: any): Promise<{
        success: boolean;
        message: string;
        chatConfig: import("src/tenant/tenant.schema").ChatConfig;
    }>;
}

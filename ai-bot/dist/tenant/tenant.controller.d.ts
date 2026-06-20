import { Model } from 'mongoose';
import { Tenant } from 'src/tenant/tenant.schema';
import { User } from 'src/user/user.schema';
import { JwtService } from '@nestjs/jwt';
export declare class PublicTenantController {
    private readonly tenantModel;
    constructor(tenantModel: Model<Tenant>);
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
        chatConfig: import("src/tenant/tenant.schema").ChatConfig;
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

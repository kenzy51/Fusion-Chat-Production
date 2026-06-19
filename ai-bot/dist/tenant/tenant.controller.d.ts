import { Model } from 'mongoose';
import { User } from 'src/user/user.schema';
import { Tenant } from 'src/tenant/tenant.schema';
export declare class PublicTenantController {
    private readonly tenantModel;
    constructor(tenantModel: Model<Tenant>);
    getPublicWidgetConfig(slug: string): Promise<{
        name: any;
        slug: any;
        primaryColor: any;
        backgroundColor: any;
        textColor: any;
        widgetTitle: any;
        greeting: any;
        knowledgeBase: any;
        chatPrompt: any;
        logoUrl: any;
    }>;
}
export declare class TenantController {
    private readonly tenantModel;
    private readonly userModel;
    constructor(tenantModel: Model<Tenant>, userModel: Model<User>);
    getCombinedProfile(req: any): Promise<{
        id: string | import("mongoose").Types.ObjectId;
        name: string;
        chatConfig: {};
        user: {
            name: string;
            email: string;
            role: string;
        };
    }>;
    updateConfig(req: any, body: any): Promise<{
        success: boolean;
        message: string;
        chatConfig: any;
    }>;
}

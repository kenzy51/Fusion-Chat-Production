import { Model } from 'mongoose';
import { User } from 'src/user/user.schema';
import { Tenant } from 'src/tenant/tenant.schema';
export declare class PublicTenantController {
    private readonly tenantModel;
    constructor(tenantModel: Model<Tenant>);
    publicWidgetMessage(body: {
        message: string;
        slug: string;
    }): Promise<{
        reply: string;
    }>;
    getPublicWidgetConfig(slug: string): Promise<{
        name: string;
        slug: string;
        primaryColor: string;
        backgroundColor: string;
        textColor: string;
        widgetTitle: string;
        greeting: string;
        logoUrl: string;
    }>;
}
export declare class TenantController {
    private readonly tenantModel;
    private readonly userModel;
    constructor(tenantModel: Model<Tenant>, userModel: Model<User>);
    getCombinedProfile(req: any): Promise<{
        name: string;
        chatConfig: {};
        user: {
            name: string;
            email: string;
            role?: undefined;
        };
        id?: undefined;
    } | {
        id: import("mongoose").Types.ObjectId;
        name: string;
        chatConfig: import("src/tenant/tenant.schema").ChatConfig;
        user: {
            name: string;
            email: string;
            role: string;
        };
    }>;
    updateConfig(req: any, body: any): Promise<{
        success: boolean;
        message: string;
        chatConfig: import("src/tenant/tenant.schema").ChatConfig;
    }>;
}

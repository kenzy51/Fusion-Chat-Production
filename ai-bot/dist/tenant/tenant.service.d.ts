import { Model } from 'mongoose';
import { Tenant } from './tenant.schema';
export declare class TenantService {
    private readonly tenantModel;
    constructor(tenantModel: Model<Tenant>);
    createTenant(slug: string, name: string): Promise<import("mongoose").Document<unknown, {}, Tenant, {}, import("mongoose").DefaultSchemaOptions> & Tenant & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    getBySlug(slug: string): Promise<Tenant | null>;
}

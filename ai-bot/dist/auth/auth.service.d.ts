import { Model } from 'mongoose';
import { User } from 'src/user/user.schema';
import { Tenant } from 'src/tenant/tenant.schema';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private readonly userModel;
    private readonly tenantModel;
    private readonly jwtService;
    constructor(userModel: Model<User>, tenantModel: Model<Tenant>, jwtService: JwtService);
    registerTenantAccount(dto: any): Promise<{
        status: string;
        tenantId: import("mongoose").Types.ObjectId;
    }>;
    login(dto: any): Promise<{
        access_token: string;
    }>;
}

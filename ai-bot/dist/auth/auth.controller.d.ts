import { Model } from 'mongoose';
import { AuthService } from './auth.service';
import { User } from 'src/user/user.schema';
import { Tenant } from 'src/tenant/tenant.schema';
import { EmailService } from './email.service';
export declare class AuthController {
    private readonly authService;
    private readonly userService;
    private readonly tenantService;
    private readonly emailService;
    constructor(authService: AuthService, userService: Model<User>, tenantService: Model<Tenant>, emailService: EmailService);
    register(registerDto: any): Promise<{
        status: string;
        tenantId: import("mongoose").Types.ObjectId;
    }>;
    login(loginDto: any): Promise<{
        access_token: string;
    }>;
    verifyEmail(token: string): Promise<{
        success: boolean;
        message: string;
    }>;
    forgotPassword(email: string): Promise<{
        success: boolean;
        message: string;
    }>;
    resetPassword(body: any): Promise<{
        success: boolean;
        message: string;
    }>;
}

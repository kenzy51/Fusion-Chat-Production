import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: any): Promise<{
        status: string;
        tenantId: import("mongoose").Types.ObjectId;
    }>;
    login(loginDto: any): Promise<{
        access_token: string;
    }>;
}

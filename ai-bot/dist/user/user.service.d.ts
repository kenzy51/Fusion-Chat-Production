import { Model } from 'mongoose';
import { User } from './user.schema';
export declare class UserService {
    private readonly userModel;
    constructor(userModel: Model<User>);
    createUser(tenantId: string, name: string, email: string, cleartextPassword: string, role?: string): Promise<{
        id: import("mongoose").Types.ObjectId;
        email: string;
        role: string;
    }>;
    findByEmail(email: string): Promise<User | null>;
}

import { Model } from 'mongoose';
import { ChatSession } from './schemas/session.schema';
export declare class SessionsService {
    private readonly sessionModel;
    constructor(sessionModel: Model<ChatSession>);
    saveSession(sessionData: Partial<ChatSession>): Promise<ChatSession>;
    getHistoryByTenant(tenantId: string): Promise<ChatSession[]>;
    findBySessionId(sessionId: string): Promise<ChatSession | null>;
    updateStatus(sessionId: string, status: string): Promise<ChatSession | null>;
    updateFlagState(sessionId: string, isFlagged: boolean): Promise<ChatSession | null>;
}

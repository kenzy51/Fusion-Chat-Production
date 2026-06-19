import { SessionsService } from './session.service';
export declare class SessionsController {
    private readonly sessionsService;
    constructor(sessionsService: SessionsService);
    getTenantSessions(tenantId: string): Promise<import("./schemas/session.schema").ChatSession[]>;
    getSessionDetails(sessionId: string): Promise<import("./schemas/session.schema").ChatSession>;
    updateSessionStatus(sessionId: string, status: string): Promise<{
        status: string;
        data: import("./schemas/session.schema").ChatSession;
    }>;
    flagSession(sessionId: string, isFlagged: boolean): Promise<import("./schemas/session.schema").ChatSession | null>;
}

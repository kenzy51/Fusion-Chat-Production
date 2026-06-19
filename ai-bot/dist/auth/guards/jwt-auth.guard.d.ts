import { Strategy } from 'passport-jwt';
declare const JwtAuthGuard_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtAuthGuard extends JwtAuthGuard_base {
    constructor();
    validate(payload: any): Promise<{
        userId: any;
        email: any;
        tenantId: any;
        role: any;
    }>;
}
export {};

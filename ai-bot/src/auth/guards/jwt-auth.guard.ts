import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      // 🎯 FIXED: Check BOTH the Authorization Header AND your Frontend Cookie automatically
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (req: Request) => {
          let token = null;
          if (req && req.cookies) {
            token = req.cookies['access_token'];
          }
          // Fallback if express cookie-parser isn't enabled (parsing raw cookie headers)
          if (!token && req && req.headers.cookie) {
            const rawCookies = req.headers.cookie.split(';');
            const targetCookie = rawCookies.find(c => c.trim().startsWith('access_token='));
            if (targetCookie) {
                // @ts-ignore
              token = targetCookie.split('=')[1];
            }
          }
          return token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'fallback_secret_key',
    });
  }

  async validate(payload: any) {
    if (!payload) {
      throw new UnauthorizedException('Invalid payload matrix context.');
    }
    // 🎯 Ensure your payload property keys match what you extract in TenantController!
    return { 
      userId: payload.sub, 
      email: payload.email, 
      tenantId: payload.tenantId, 
      role: payload.role 
    };
  }
}
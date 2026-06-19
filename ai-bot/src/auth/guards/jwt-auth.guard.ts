import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      // Read the text out of the Authorization: Bearer envelope sent from Next.js
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // 🎯 FIXED: Explicit local string fallback key to guarantee matching signatures
      secretOrKey: 'fallback_secret_key', 
    });
  }

  async validate(payload: any) {
    // This payload data maps right down into req.user
    return { 
      userId: payload.sub, 
      email: payload.email, 
      tenantId: payload.tenantId, 
      role: payload.role 
    };
  }
}
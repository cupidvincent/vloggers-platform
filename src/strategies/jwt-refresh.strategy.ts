import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
    Strategy,
    'jwt-refresh',
) {
    constructor(private config: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req) => req?.cookies?.refresh_token,
            ]),
            secretOrKey: config.get('jwt.refresh_secret'),
            passReqToCallback: true,
        } as any);
    }

    async validate(req: Request, payload: any) {
        const refreshToken = req?.cookies?.refresh_token;

        return {
            userId: payload.sub,
            username: payload.email,
            refreshToken,
        };
    }
}

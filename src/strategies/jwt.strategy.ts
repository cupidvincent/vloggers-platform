import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private config: ConfigService) {
        super({
            // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req) => req?.cookies?.access_token,
            ]),
            ignoreExpiration: false,
            secretOrKey: config.get('jwt.secret'),
        } as any);
    }

    async validate(payload: any) {
        return {
            userId: payload.sub,
            username: payload.email || payload.username,
        };
    }
}

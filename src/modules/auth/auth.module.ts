import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DatabaseModule } from '../database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtRefreshStrategy } from 'src/strategies/jwt-refresh.strategy';
import { JwtStrategy } from 'src/strategies/jwt.strategy';
import { LocalStrategy } from 'src/strategies/local.strategy';
import { ConfigService } from '@nestjs/config';

@Module({
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, JwtStrategy, JwtRefreshStrategy],
    imports: [
        DatabaseModule,
        PassportModule,
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                secret: config.get<string>('jwtSecret') || 'fallback-secret',
                signOptions: {
                    expiresIn:
                        (config.get<string>('jwtExpiresIn') as any) || '1m',
                },
            }),
        }),
    ],
    exports: [AuthService],
})
export class AuthModule {}

import { DatabaseService } from '../database/database.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UpdateAuthDto } from './dto/update-auth.dto';
// import { Prisma } from 'generated/prisma/client';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/config/constants';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private databaseService: DatabaseService,
        private jwtService: JwtService,
        private config: ConfigService,
    ) {}
    signup(createAuthDto: Prisma.AuthUsersCreateInput) {
        return this.databaseService.signup(createAuthDto);
    }

    async validateUser(email: string, password: string): Promise<any> {
        const authUser = await this.databaseService.getUserByEmail(email);
        if (!authUser) return null;
        const isMatch = await bcrypt.compare(password, authUser.password);
        if (authUser && isMatch) {
            const { password, ...result } = authUser;
            return result;
        }
        return null;
    }

    async login(user: any, pw: string) {
        if (!user?.email) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const authUser = await this.databaseService.getUserByEmail(user.email);

        if (!authUser) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const isMatch = await bcrypt.compare(pw, authUser.password);
        if (!isMatch) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const payload = {
            sub: authUser.id,
            email: authUser.email,
        };

        const access_token = this.jwtService.sign(payload);

        const refresh_token = this.jwtService.sign(payload, {
            secret: jwtConstants.refresh_secret,
            expiresIn: '7d',
        });
        const hashed = await bcrypt.hash(refresh_token, 10);
        const { password, id, ...result } = authUser;
        this.databaseService.createRefreshToken(id, hashed);
        // 4️⃣ Return token
        return {
            ...result,
            access_token,
            refresh_token,
        };
    }

    async refreshTokens(userId: number, refreshToken: string) {
        const tokens = await this.databaseService.findRefreshTokens(userId);
        const authUser = await this.databaseService.findById(userId);
        if (!authUser) {
            throw new UnauthorizedException('Invalid credentials');
        }
        let matchedToken: {
            id: number;
            createdAt: Date;
            token: string;
            authUserId: number;
        } | null = null;

        for (const token of tokens) {
            const isMatch = await bcrypt.compare(refreshToken, token.token);
            if (isMatch) {
                matchedToken = token;
                break;
            }
        }

        if (!matchedToken) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        const payload = { sub: userId, username: authUser.email };

        // 🔄 rotate tokens
        const newAccessToken = this.jwtService.sign(payload, {
            secret: this.config.get('jwt.secret'),
            expiresIn: this.config.get('jwt.secret_life'),
        });

        const newRefreshToken = this.jwtService.sign(payload, {
            secret: this.config.get('jwt.refresh_secret'),
            expiresIn: this.config.get('jwt.efresh_life'),
        });

        // ❗ delete only the used token (device-specific)
        await this.databaseService.deleteRefreshToken(matchedToken.id);

        const hashed = await bcrypt.hash(newRefreshToken, 10);

        await this.databaseService.createRefreshToken(userId, hashed);
        const { password, id, ...result } = authUser;
        return {
            user: result,
            access_token: newAccessToken,
            refresh_token: newRefreshToken,
        };
    }

    findAll() {
        return `This action returns all auth`;
    }

    findOne(id: number) {
        return `This action returns a #${id} auth`;
    }

    update(id: number, updateAuthDto: UpdateAuthDto) {
        return `This action updates a #${id} ${updateAuthDto.email} auth`;
    }

    remove(id: number) {
        return `This action removes a #${id} auth`;
    }
}

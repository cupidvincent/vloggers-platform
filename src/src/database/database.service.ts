import { Injectable } from '@nestjs/common';

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, Prisma } from 'generated/prisma/client';

@Injectable()
export class DatabaseService extends PrismaClient {
    constructor() {
        const adapter = new PrismaPg({
            connectionString: process.env.DATABASE_URL as string,
        });
        super({ adapter });
    }

    /**
     *
     * refresh tokens operations
     *
     */

    async findRefreshTokens(userId: number) {
        return this.refreshToken.findMany({
            where: { userId },
        });
    }

    async deleteRefreshToken(id: number) {
        return this.refreshToken.delete({
            where: { id },
        });
    }

    async createRefreshToken(userId: number, token: string) {
        return this.refreshToken.create({
            data: {
                token,
                userId,
            },
        });
    }
}

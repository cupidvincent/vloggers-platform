// import { Injectable } from '@nestjs/common';

// import { PrismaPg } from '@prisma/adapter-pg';
// import { PrismaClient, Prisma } from 'generated/prisma/client';
// import bcrypt from 'bcrypt';

// @Injectable()
// export class DatabaseService extends PrismaClient {
//     constructor() {
//         const adapter = new PrismaPg({
//             connectionString: process.env.DATABASE_URL as string,
//         });
//         super({ adapter });
//     }

//     /**
//      *
//      * Auth Operations
//      *
//      * */

//     async signup(data: Prisma.AuthUsersCreateInput) {
//         const saltRounds = 10;
//         if (!data.password) return;
//         const hashedPassword = await bcrypt.hash(data.password, saltRounds);

//         return this.authUsers.create({
//             data: {
//                 ...data,
//                 password: hashedPassword,
//             },
//         });
//     }
// }
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';

@Injectable()
export class DatabaseService extends PrismaClient {
    constructor(private config: ConfigService) {
        const adapter = new PrismaPg({
            connectionString: config.getOrThrow<string>('database.url'),
        });

        super({
            adapter,
        });
    }

    /**
     *
     * Auth Operations
     *
     * */

    async signup(data: Prisma.AuthUsersCreateInput) {
        const saltRounds = 10;

        if (!data.password) {
            throw new Error('Password is required');
        }

        const hashedPassword: string = await bcrypt.hash(
            data.password,
            saltRounds,
        );

        return this.authUsers.create({
            data: {
                ...data,
                password: hashedPassword,
            },
        });
    }

    async createRefreshToken(userId: number, token: string) {
        return this.refreshToken.create({
            data: {
                token,
                authUserId: userId,
            },
        });
    }

    async findRefreshTokens(userId: number) {
        return this.refreshToken.findMany({
            where: { authUserId: userId },
        });
    }

    async deleteRefreshToken(id: number) {
        return this.refreshToken.delete({
            where: { id },
        });
    }

    /**
     *
     * User Operations
     *
     * */

    async getUserByEmail(email: string) {
        return this.authUsers.findUnique({
            where: {
                email,
            },
        });
    }

    async findById(id: number) {
        return this.authUsers.findUnique({
            where: {
                id,
            },
        });
    }
}

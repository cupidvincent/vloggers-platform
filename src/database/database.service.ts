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

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';

@Injectable()
export class DatabaseService extends PrismaClient {
    constructor() {
        const adapter = new PrismaPg({
            connectionString: process.env.DATABASE_URL as string,
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
}

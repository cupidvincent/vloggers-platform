import { DatabaseService } from '../database/database.service';
import { Injectable } from '@nestjs/common';
import { UpdateAuthDto } from './dto/update-auth.dto';
// import { Prisma } from 'generated/prisma/client';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthService {
    constructor(private databaseService: DatabaseService) {}
    signup(createAuthDto: Prisma.AuthUsersCreateInput) {
        return this.databaseService.signup(createAuthDto);
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

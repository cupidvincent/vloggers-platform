import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateAuthDto {
    @ApiProperty()
    @IsString()
    firstName: string;

    @ApiProperty()
    @IsString()
    lastName: string;

    @ApiProperty()
    @IsString()
    email: string;

    @ApiProperty()
    @IsString()
    password: string;
}

export class LoginDto {
    @ApiProperty()
    @IsString()
    email: string;

    @ApiProperty()
    @IsString()
    password: string;
}

import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Res,
    Req,
    Param,
    Delete,
    ValidationPipe,
    UseGuards,
    Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LocalAuthGuard } from '../../guards/local-auth.guard';
import { JwtRefreshGuard } from '../../guards/jwt-refresh.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('signup')
    signup(@Body(ValidationPipe) createAuthDto: CreateAuthDto) {
        return this.authService.signup(createAuthDto);
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req, @Res({ passthrough: true }) res) {
        const { access_token, refresh_token, ...rest } =
            await this.authService.login(req.user, req.body.password);

        res.cookie('access_token', access_token, {
            httpOnly: true,
            secure: false, // true in production (https)
        });

        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: false, // true in production (https)
        });
        return rest;
    }

    @UseGuards(JwtRefreshGuard)
    @Post('refresh')
    async refresh(@Req() req, @Res({ passthrough: true }) res) {
        const { access_token, refresh_token, user } =
            await this.authService.refreshTokens(
                req.user.userId,
                req.user.refreshToken,
            );

        res.cookie('access_token', access_token, { httpOnly: true });
        res.cookie('refresh_token', refresh_token, { httpOnly: true });

        return { success: true };
    }

    @Get()
    findAll() {
        return this.authService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.authService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
        return this.authService.update(+id, updateAuthDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.authService.remove(+id);
    }
}

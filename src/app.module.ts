import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './src/auth/auth.module';
import { DatabaseModule } from './src/database/database.module';
import { AuthController } from './src/auth/auth.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        AuthModule,
        DatabaseModule,
    ],
    controllers: [AppController, AuthController],
    providers: [AppService],
})
export class AppModule {}

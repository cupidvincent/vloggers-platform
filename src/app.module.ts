import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './modules/database/database.module';
import { AuthController } from './modules/auth/auth.controller';
import { ConfigModule } from '@nestjs/config';
import { IntegrationsModule } from './modules/integrations/integrations.module';
import appConfig from './config/app.config';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [appConfig],
        }),
        AuthModule,
        DatabaseModule,
        IntegrationsModule,
    ],
    controllers: [AppController, AuthController],
    providers: [AppService],
})
export class AppModule {}

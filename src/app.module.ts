import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './src/auth/auth.module';
import { DatabaseService } from './src/database/database.service';
import { DatabaseModule } from './src/database/database.module';

@Module({
    imports: [AuthModule, DatabaseModule],
    controllers: [AppController],
    providers: [AppService, DatabaseService],
})
export class AppModule {}

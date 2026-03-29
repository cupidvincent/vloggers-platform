import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api');
    app.enableCors({
        origin: 'http://localhost:5173',
        credentials: true,
    });

    app.use(cookieParser());

    const config = new DocumentBuilder()
        .setTitle('Vloggers Platform APIs')
        .setDescription('Dexter / Philip / Cupid')
        .setVersion('1.0')
        // .addCookieAuth('refresh_token', {
        //     type: 'apiKey',
        //     in: 'cookie',
        // })
        // .addCookieAuth('access_token', {
        //     type: 'apiKey',
        //     in: 'cookie',
        // })
        // .addBearerAuth(
        //     {
        //         type: 'http',
        //         scheme: 'bearer',
        //         bearerFormat: 'JWT',
        //     },
        //     'access_token', // name (important)
        // )
        .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, documentFactory);

    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

import { AppModule } from 'src/app.module';

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

async function initNest () {
    const app = await NestFactory.create(AppModule);

    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new ValidationPipe());
    
    return app;
}

export default initNest;
import { AppModule } from 'src/app.module';

import { NestFactory } from '@nestjs/core';

async function initNest () {
    const app = await NestFactory.create(AppModule);

    app.setGlobalPrefix('api/v1')
    
    return app;
}

export default initNest
import { INestApplication } from '@nestjs/common';
import {
    DocumentBuilder,
    SwaggerModule,
} from '@nestjs/swagger';

const initSwagger = (app: INestApplication) => {
    const config = new DocumentBuilder()
        .setTitle('NestApp API')
        .setDescription('API documentation')
        .setVersion('1.0')
        .build();

    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('documentation', app, documentFactory);
};

export default initSwagger;
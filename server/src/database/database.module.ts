import fs from 'node:fs';

import { Module } from '@nestjs/common';
import {
    ConfigModule,
    ConfigService,
} from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
              
                return {
                    type: 'postgres',
                    host: configService.getOrThrow('DB_HOST'),
                    port: +configService.get('DB_PORT'),
                    username: configService.getOrThrow('DB_USERNAME'),
                    password: configService.getOrThrow('DB_PASSWORD'),
                    database: configService.getOrThrow('DB_NAME'),
                    synchronize: configService.getOrThrow('DB_SYNCHRONIZE'),
                    autoLoadEntities: true,
                    ssl: {
                        rejectUnauthorized: true,
                        ca: fs.readFileSync('./ca.pem'),
                    },
                };
            },
        }),
    ],
})
export class DatabaseModule {}
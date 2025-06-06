import fs from 'node:fs';

import { Module } from '@nestjs/common';
import {
    ConfigModule,
    ConfigService,
} from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TypeOrmFeatureModule } from './typeorm-feature.module';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {

                const isDev = process.env.NODE_ENV === 'dev';
              
                return {
                    type: 'postgres',
                    host: configService.getOrThrow('DB_HOST'),
                    port: +configService.get('DB_PORT'),
                    username: configService.getOrThrow('DB_USERNAME'),
                    password: configService.getOrThrow('DB_PASSWORD'),
                    database: configService.getOrThrow('DB_NAME'),
                    synchronize: configService.getOrThrow('DB_SYNCHRONIZE'),
                    autoLoadEntities: true,
                    ssl: isDev
                        ? false
                        : {
                            rejectUnauthorized: true,
                            ca: fs.readFileSync('./ca.pem'),
                        },
                };
            },
        }), TypeOrmFeatureModule,
    ],
    exports: [TypeOrmModule, TypeOrmFeatureModule],
})
export class DatabaseModule {}
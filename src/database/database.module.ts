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
                    host: configService.getOrThrow<string>('DB_HOST'),
                    port: configService.getOrThrow<number>('DB_PORT'),
                    username: configService.getOrThrow<string>('DB_USERNAME'),
                    password: configService.getOrThrow<string>('DB_PASSWORD'),
                    database: configService.getOrThrow<string>('DB_NAME'),
                    synchronize: configService.getOrThrow<boolean>('DB_SYNCHRONIZE'),
                    autoLoadEntities: true,
                };
            },
        }),
    ],
})
export class DatabaseModule {}
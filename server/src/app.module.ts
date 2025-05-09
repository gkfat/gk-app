import {
    FugleMarketDataModule,
    FugleMarketDataModuleOptions,
} from '@fugle/marketdata-nest';
import {
    RedisModule,
    RedisModuleOptions,
} from '@liaoliaots/nestjs-redis';
import {
    BullModule,
    BullRootModuleOptions,
} from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import {
    ConfigModule,
    ConfigService,
} from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';

import { DatabaseModule } from './database/database.module';
import { OperationLogInterceptor } from './interceptors/operation-log.interceptor';
import { MiddlewaresModule } from './middlewares/middlewares.module';
import { AccountsModule } from './modules/accounts/accounts.module';
import { AuditingModule } from './modules/auditing/auditing.module';
import { AuthModule } from './modules/auth/auth.module';
import { HealthModule } from './modules/health/health.module';
import { MarketDataModule } from './modules/market-data/market-data.module';
import { PortfoliosModule } from './modules/portfolios/portfolios.module';
import { PrivilegesModule } from './modules/privileges/privileges.module';

const envFilePath = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env'; 

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: [envFilePath],
        }),
        RedisModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService): Promise<RedisModuleOptions> => {
                return {
                    readyLog: true,
                    config: {
                        host: configService.getOrThrow('REDIS_HOST'),
                        port: +configService.getOrThrow('REDIS_PORT'),
                        username: configService.get('REDIS_USERNAME'),
                        password: configService.get('REDIS_PASSWORD'),
                    },
                };
            },
        }),
        BullModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService): Promise<BullRootModuleOptions> => {
                return {
                    connection: {
                        host: configService.getOrThrow('REDIS_HOST'),
                        port: +configService.getOrThrow('REDIS_PORT'),
                        username: configService.get('REDIS_USERNAME'),
                        password: configService.get('REDIS_PASSWORD'),
                    },
                };
            },
        }),
        ScheduleModule.forRoot(),
        FugleMarketDataModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService): Promise<FugleMarketDataModuleOptions> => {
                return { apiKey: configService.getOrThrow('FUGLE_API_KEY') };
            },
        }),
        MiddlewaresModule,
        DatabaseModule,
        
        HealthModule,
        AuthModule,
        AccountsModule,
        PrivilegesModule,
        PortfoliosModule,
        MarketDataModule,
        AuditingModule,
    ],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: OperationLogInterceptor,
        },
    ],
})
export class AppModule {}

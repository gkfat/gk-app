import {
    FugleMarketDataModule,
    FugleMarketDataModuleOptions,
} from '@fugle/marketdata-nest';
import {
    RedisModule,
    RedisModuleOptions,
} from '@liaoliaots/nestjs-redis';
import { Module } from '@nestjs/common';
import {
    ConfigModule,
    ConfigService,
} from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { DatabaseModule } from './database/database.module';
import { MiddlewaresModule } from './middlewares/middlewares.module';
import { AccountsModule } from './modules/accounts/accounts.module';
import { AuthModule } from './modules/auth/auth.module';
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
        AuthModule,
        AccountsModule,
        PrivilegesModule,
        PortfoliosModule,
        MarketDataModule,
    ],
})
export class AppModule {}

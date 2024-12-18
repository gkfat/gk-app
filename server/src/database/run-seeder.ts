import { AppModule } from 'src/app.module';
import { AccountAuth } from 'src/modules/accounts/entities/account-auth.entity';
import { Account } from 'src/modules/accounts/entities/account.entity';
import { Portfolio } from 'src/modules/portfolios/enities/portfolio.entity';
import {
    CashTradeRecord,
    FXTradeRecord,
    StockTradeRecord,
} from 'src/modules/portfolios/enities/trade-record.entity';
import { Role } from 'src/modules/privileges/entities/role.entity';
import {
    DataSource,
    DataSourceOptions,
} from 'typeorm';
import {
    runSeeders,
    SeederOptions,
} from 'typeorm-extension';

import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

const logger = new Logger('seeder');

async function run() {
    try {
        const app = await NestFactory.createApplicationContext(AppModule);
        const configService = app.get(ConfigService);
    
        const options: DataSourceOptions & SeederOptions = {
            type: 'postgres',
            host: configService.getOrThrow('DB_HOST'),
            port: +configService.getOrThrow('DB_PORT'),
            username: configService.getOrThrow('DB_USERNAME'),
            password: configService.getOrThrow('DB_PASSWORD'),
            database: configService.getOrThrow('DB_NAME'),
            entities: [
                Account,
                AccountAuth,
                Role,
                Portfolio,
                StockTradeRecord,
                FXTradeRecord,
                CashTradeRecord,
            ],
    
            seeds: ['src/database/seeds/**/*{.ts,.js}'],
        };
    
        const dataSource = new DataSource(options);
    
        await dataSource.initialize();
        
        await runSeeders(dataSource);

        logger.log('Seeding completed, closing app.');

        app.close();
    } catch (err) {
        logger.error('Error running seeders: ', err);
        throw err;
    }
}

run();
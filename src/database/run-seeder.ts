import { AppModule } from 'src/app.module';
import { AccountAuth } from 'src/modules/accounts/entities/account-auth.entity';
import { Account } from 'src/modules/accounts/entities/account.entity';
import { Role } from 'src/modules/roles/entities/role.entity';
import {
    DataSource,
    DataSourceOptions,
} from 'typeorm';
import {
    runSeeders,
    SeederOptions,
} from 'typeorm-extension';

import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

async function run() {
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
        ],

        seeds: ['src/database/seeds/**/*{.ts,.js}'],
    };

    const dataSource = new DataSource(options);

    await dataSource.initialize();
    
    await runSeeders(dataSource);

}

run().then(() => {
    console.log('Seeding completed, closing app.');
}).catch((err) => {
    console.error('Error running seeders: ', err);
}).finally(() => {
    process.exit(1);
});
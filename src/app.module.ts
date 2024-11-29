import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DatabaseModule } from './database/database.module';
import { AccountsModule } from './modules/accounts/accounts.module';
import { RolesModule } from './modules/roles/roles.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: [
                `.env.${process.env.NODE_ENV}`,
                '.env' // fallback to .env if specific env file not found
            ]
        }),
        DatabaseModule,
        AccountsModule,
        RolesModule,
    ],
})
export class AppModule {}

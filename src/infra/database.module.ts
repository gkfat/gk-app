import { AccountAuth } from 'src/modules/accounts/account-auth.entity';
import { Account } from 'src/modules/accounts/account.entity';
import { Role } from 'src/modules/roles/role.entity';

import { Module } from '@nestjs/common';
import {
    ConfigModule,
    ConfigService,
} from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        ConfigModule,
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
                return {
                    type: 'postgres',
                    host: configService.get<string>('DB_HOST'),
                    port: configService.get<number>('DB_PORT'),
                    username: configService.get<string>('DB_USERNAME'),
                    password: configService.get<string>('DB_PASSWORD'),
                    database: configService.get<string>('DB_NAME'),
                    autoLoadEntities: true
                }
            }
        }),
    ],
    exports: [TypeOrmModule.forFeature([
        Account, AccountAuth, Role
    ])]
})
export class DatabaseModule {}
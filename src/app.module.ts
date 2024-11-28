import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DatabaseModule } from './infra/database.module';
import { AccountsModule } from './modules/accounts/accounts.module';
import { RolesModule } from './modules/roles/roles.module';

@Module({
  imports: [
    ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: '.env'
    }),
    DatabaseModule,
    AccountsModule,
    RolesModule,
  ],
})
export class AppModule {}

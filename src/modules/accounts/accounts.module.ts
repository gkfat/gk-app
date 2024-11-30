import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { AccountAuth } from './entities/account-auth.entity';
import { Account } from './entities/account.entity';

@Module({
    imports: [JwtModule, TypeOrmModule.forFeature([Account, AccountAuth])],
    controllers: [AccountsController],
    providers: [AccountsService],
    exports: [AccountsService],
})
export class AccountsModule {}

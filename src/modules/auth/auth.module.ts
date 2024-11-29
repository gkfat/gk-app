import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AccountsModule } from '../accounts/accounts.module';
import { AccountAuth } from '../accounts/entities/account-auth.entity';
import { Account } from '../accounts/entities/account.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { OAuthService } from './oauth.service';

@Module({
    imports: [AccountsModule, TypeOrmModule.forFeature([Account, AccountAuth])],
    controllers: [AuthController],
    providers: [AuthService, OAuthService],
})
export class AuthModule {}

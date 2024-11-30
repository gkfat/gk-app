import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MiddlewaresModule } from '../../middlewares/middlewares.module';
import { AccountsModule } from '../accounts/accounts.module';
import { AccountAuth } from '../accounts/entities/account-auth.entity';
import { Account } from '../accounts/entities/account.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { OAuthService } from './oauth.service';

@Module({
    imports: [
        JwtModule,
        MiddlewaresModule,
        AccountsModule,
        TypeOrmModule.forFeature([Account, AccountAuth]),
    ],
    controllers: [AuthController],
    providers: [AuthService, OAuthService],
})
export class AuthModule {}

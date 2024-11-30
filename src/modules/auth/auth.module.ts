import { Module } from '@nestjs/common';
import {
    ConfigModule,
    ConfigService,
} from '@nestjs/config';
import {
    JwtModule,
    JwtModuleOptions,
} from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AccountsModule } from '../accounts/accounts.module';
import { AccountAuth } from '../accounts/entities/account-auth.entity';
import { Account } from '../accounts/entities/account.entity';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { OAuthService } from './oauth.service';

@Module({
    imports: [
        AccountsModule,
        TypeOrmModule.forFeature([Account, AccountAuth]),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService): JwtModuleOptions => {
                const secret = configService.get('JWT_SECRET');
                const expiresIn = configService.get('JWT_EXPIRES_IN') || '1d';

                return {
                    global: true,
                    secret,
                    signOptions: {
                        expiresIn,
                        algorithm: 'HS256', 
                    },
                };
            },
        }),
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        OAuthService,
        AuthGuard,
    ],
})
export class AuthModule {}

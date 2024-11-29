import { Redis } from 'ioredis';
import * as jwt from 'jsonwebtoken';
import ms from 'ms';
import { LoginType } from 'src/enums/login-type.enum';
import { verifyPasswordLogin } from 'src/utils/credential';
import { getBase64Uuid } from 'src/utils/uuid';
import { EntityManager } from 'typeorm';

import { RedisService } from '@liaoliaots/nestjs-redis';
import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AccountAuth } from '../accounts/entities/account-auth.entity';
import { Account } from '../accounts/entities/account.entity';
import { LoginOrCreateDto } from './dto/login-or-create.dto';
import { OAuthService } from './oauth.service';

@Injectable()
export class AuthService {
    private readonly redisClient: Redis;

    constructor(
        private readonly redisService: RedisService,
        private readonly configService: ConfigService,
        private readonly oauthService: OAuthService,
        private readonly entityManager: EntityManager,
    ) {
        this.redisClient = this.redisService.getOrThrow();
    }

    async loginOrCreate(reqBody: LoginOrCreateDto) {
        let id: number | null = null;

        const {
            type, email, 
        } = reqBody;

        if (type === LoginType.PASSWORD) {
            const findAuth = await this.entityManager.findOne(AccountAuth,
                {
                    where: {
                        type,
                        identifier: email,
                    },
                });

            if (!findAuth) {
                throw new BadRequestException('Invalid email or password');
            }

            const validLogin = verifyPasswordLogin(reqBody, findAuth);

            if (!validLogin) {
                throw new UnauthorizedException('Invalid email or password');
            }

            id = findAuth.account_id;
        }
        // 第三方登入
        else  {
            if (!this.oauthService[type]) {
                throw new BadRequestException(`Unsuppoerted login type ${type}`);
            }

            const oauthResult = await this.oauthService[type](reqBody);

            if (!oauthResult) {
                throw new UnauthorizedException('Oauth login fail');
            }

            const findAuth = await this.entityManager.findOne(AccountAuth, {
                where: {
                    type,
                    identifier: oauthResult.identifier,
                },
            });

            // 找不到 auth data, 自動建立帳號
            if (!findAuth) {
                const newAccount = new Account({
                    email: oauthResult.email,
                    name: oauthResult.name,
                    auths: [
                        new AccountAuth({
                            type,
                            identifier: oauthResult.identifier,
                            credential: oauthResult.credential,
                        }),
                    ],
                });

                id = (await this.entityManager.save(newAccount)).id;
            } else {
                id = findAuth.account_id;
            }
        }

        await this.entityManager.update(Account, id, { last_login_at: new Date() });

        return { id };
    }

    async generateJwt(account: Account) {
        const secret = this.configService.get('JWT_SECRET');
        const expiresIn = this.configService.get('JWT_EXPIRES_IN') || '1d';

        const jti = getBase64Uuid();
        const token = jwt.sign(
            { scopes: account },
            secret,
            {
                expiresIn,
                algorithm: 'HS256',
                jwtid: jti,
            },
        );

        const ttl = ms(expiresIn);

        await this.redisClient.set(`token:${account.id}`, jti, 'PX',ttl);

        return token;
    }

}


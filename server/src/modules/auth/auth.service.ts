import Redis from 'ioredis';
import ms from 'ms';
import { ITokenPayload } from 'src/decorators/token-payload.decorators';
import { LoginType } from 'src/enums/login-type.enum';
import { Roles } from 'src/enums/roles.enum';
import { verifyPasswordLogin } from 'src/utils/credential';
import { getPermissionsByRoles } from 'src/utils/permissions';
import { getBase64Uuid } from 'src/utils/uuid';
import { EntityManager } from 'typeorm';

import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { CacheService } from '../../middlewares/cache.service';
import { AccountAuth } from '../accounts/entities/account-auth.entity';
import { Account } from '../accounts/entities/account.entity';
import { Role } from '../roles/entities/role.entity';
import { LoginOrCreateDto } from './dto/login-or-create.dto';
import { OAuthService } from './oauth.service';

@Injectable()
export class AuthService {
    private client: Redis;

    constructor(
        private readonly cacheService: CacheService,
        private readonly configService: ConfigService,
        private readonly oauthService: OAuthService,
        private readonly entityManager: EntityManager,
        private readonly jwtService: JwtService,
    ) {}

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
                    withDeleted: false,
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
                withDeleted: false,
            });

            // 找不到 auth data, 自動建立帳號
            if (!findAuth) {
                const findMemberRole = await this.entityManager.findOne(Role, {
                    where: { role: Roles.MEMBER },
                    withDeleted: false, 
                });

                const newAccount = new Account({
                    email: oauthResult.email,
                    name: oauthResult.name,
                    avatar: oauthResult.avatar,
                    auths: [
                        new AccountAuth({
                            type,
                            identifier: oauthResult.identifier,
                            credential: oauthResult.credential,
                        }),
                    ],
                    roles: [findMemberRole],
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
        const getPermissions = getPermissionsByRoles(account.roles);

        const payload: ITokenPayload = {
            scope: {
                sub: account.id,
                email: account.email,
                name: account.name,
                roles: account.roles,
                permissions: getPermissions,
            },
        };

        const jti = getBase64Uuid();

        const secret = this.configService.get('JWT_SECRET');
        const expiresIn = this.configService.get('JWT_EXPIRES_IN') || '1d';

        const token = await this.jwtService.signAsync(payload, {
            jwtid: jti, secret, expiresIn, algorithm: 'HS256', 
        });

        const ttl = ms(expiresIn);

        await this.cacheService.deleteValue(`token:${account.id}`);
        await this.cacheService.setValue(`token:${account.id}`, jti, ttl);

        return token;
    }

    async setValue(key: string , value: string, ttl: string) {
        return await this.client.set(key, value, 'PX', ttl);
    }

    async getValue(key: string) {
        return await this.client.get(key);
    }

    async deleteValue(key: string) {
        return await this.client.del(key);
    }
}


import { LoginType } from 'src/enums/login-type.enum';
import { Roles } from 'src/enums/roles.enum';
import { hashPassword } from 'src/utils/credential';
import { getPermissionsByRoles } from 'src/utils/permissions';
import {
    EntityManager,
    Repository,
} from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { SignUpDto } from '../auth/dto/sign-up.dto';
import { Role } from '../roles/entities/role.entity';
import { CreateAccountDto } from './dto/create-account.dto';
import { AccountAuth } from './entities/account-auth.entity';
import { Account } from './entities/account.entity';

@Injectable()
export class AccountsService {
    constructor(
        @InjectRepository(Account)
        private accountRepository: Repository<Account>,
        private readonly entityManager: EntityManager,
    ) {}

    async create(createAccountDto: CreateAccountDto | SignUpDto) {
        const {
            email,
            password,
        } = createAccountDto;

        const findRole = await this.entityManager.findOne(Role, { where: { role: Roles.GUEST } });

        const newAccount = new Account({
            ...createAccountDto,
            roles: [findRole],
            auths: [
                new AccountAuth({
                    type: LoginType.PASSWORD, identifier: email, credential: hashPassword(password), 
                }),
            ],
        });

        const { id } = await this.accountRepository.save(newAccount);

        return await this.accountRepository.findOne({
            where: { id },
            relations: { roles: true },
        });
    }
    
    async findAll() {
        return this.accountRepository.find({ relations: { roles: true } });
    }

    async findOne(id: number) {
        const account =  await this.accountRepository.findOne({
            where: { id },
            relations: { roles: true }, 
        });

        const getPermissions = getPermissionsByRoles(account.roles);

        return {
            ...account,
            permissions: getPermissions,
        };
    }

    async findOneByEmail(email: string) {
        return this.accountRepository.findOneBy({ email });
    }

}


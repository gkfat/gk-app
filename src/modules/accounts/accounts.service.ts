import {
    EntityManager,
    Repository,
} from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateAccountDto } from './dto/create-account.dto';
import { Account } from './entities/account.entity';

@Injectable()
export class AccountsService {
    constructor(
        @InjectRepository(Account)
        private accountRepository: Repository<Account>,
        private readonly entityManager: EntityManager,
    ) {}

    async create(createAccontDto: CreateAccountDto) {
        const account = new Account(createAccontDto);
        return await this.accountRepository.save(account);
    }
    
    async findAll() {
        return this.accountRepository.find({ relations: { roles: true } });
    }

    async findOne(id: number) {
        return this.accountRepository.findOneBy({ id });
    }

}


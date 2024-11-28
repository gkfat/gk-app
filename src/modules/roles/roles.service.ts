import {
    EntityManager,
    Repository,
} from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateRoleDto } from './dto/create-role.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
    constructor(
        @InjectRepository(Role)
        private rolesRepository: Repository<Role>,
        private readonly entityManager: EntityManager
    ) {}

    async create(createRoleDto: CreateRoleDto) {
        const role = new Role(createRoleDto)
        return await this.entityManager.save(role);
    }
    
    async findAll() {
        return this.rolesRepository.find();
    }
}


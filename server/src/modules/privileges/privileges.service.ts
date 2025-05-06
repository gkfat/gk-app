import { EnumRole } from 'src/enums';
import {
    EntityManager,
    Not,
    Repository,
} from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { RoleDto } from './dto/role.dto';
import { RolePermission } from './entities/role-permission.entity';
import { Role } from './entities/role.entity';

function toRoleDto(role: Role): RoleDto {
    return {
        id: role.id,
        role: role.role,
        permissions: role.permissions?.map((p) => p.permission),
    };
}

@Injectable()
export class PrivilegesService {
    constructor(
        @InjectRepository(Role)
        private rolesRepository: Repository<Role>,
        private readonly entityManager: EntityManager,
    ) {}

    async findRole(roleId: number) {
        const result = await this.rolesRepository.findOne({
            where: { id: roleId },
            relations: { permissions: true }, 
        });
        
        return new Role(result);
    }

    async listRoles(): Promise<RoleDto[]> {
        const result = await this.rolesRepository.find({ where: { role: Not(EnumRole.SUPER) } });
        
        return result.map(role => toRoleDto(role));
    }

    async listPermissions(): Promise<RoleDto[]> {
        const result = await this.rolesRepository.find({
            where: { role: Not(EnumRole.SUPER) },
            relations: { permissions: true }, 
        });
        
        return result.map(role => toRoleDto(role));
    }

    async updatePermissions(data: {roleId: number; permissions: string[]}): Promise<RoleDto> {
        const {
            roleId,
            permissions,
        } = data;

        const result = await this.entityManager.transaction(async (trx) => {
            const findRole = await trx.findOne(Role, {
                where: { id: roleId },
                relations: { permissions: true },
            });

            findRole.permissions = permissions.map((permission) => new RolePermission({ permission }));
            
            return await trx.save(findRole);
        });

        return toRoleDto(result);
    }
}


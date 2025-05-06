import { EnumRole } from 'src/enums';
import {
    EntityManager,
    Not,
    Repository,
} from 'typeorm';

import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { PermissionDto } from './dto/permission.dto';
import { RoleDto } from './dto/role.dto';
import { UpdatePermissionRequestDto } from './dto/update-permission.dto';
import { Permission } from './entities/permission.entity';
import { Role } from './entities/role.entity';

function toRoleDto(role: Role): RoleDto {
    return {
        id: role.id,
        role: role.role,
        permissions: role.permissions?.sort((a, b) => a.permission.localeCompare(b.permission)),
    };
}

function toPermissionDto(permission: Permission): PermissionDto {
    return {
        id: permission.id,
        permission: permission.permission,
        description: permission.description,
    };
}

@Injectable()
export class PrivilegesService {
    constructor(
        @InjectRepository(Role)
        private roleRepository: Repository<Role>,
        @InjectRepository(Permission)
        private permissionRepository: Repository<Permission>,
        private readonly entityManager: EntityManager,
    ) {}

    async listRoles(): Promise<RoleDto[]> {
        const result = await this.roleRepository.find({ where: { role: Not(EnumRole.SUPER) } });
        
        return result.map(role => toRoleDto(role));
    }

    async listPermissions(): Promise<PermissionDto[]> {
        const result = await this.permissionRepository.find();
        
        return result.map(p => toPermissionDto(p)).sort((a, b) => a.permission.localeCompare(b.permission));
    }

    async updatePermission(data: { permissionId: number } & UpdatePermissionRequestDto): Promise<PermissionDto> {
        const {
            permissionId,
            description,
        } = data;

        const result = await this.entityManager.transaction(async (trx) => {
            const findPermission = await trx.findOne(Permission, { where: { id: permissionId } });

            if (!findPermission) {
                throw new NotFoundException(`permission ${permissionId} not exist`);
            }

            findPermission.description = description;

            return await trx.save(findPermission);
        });

        return toPermissionDto(result);
    }

    async listPrivileges(): Promise<RoleDto[]> {
        const result = await this.roleRepository.find({
            where: { role: Not(EnumRole.SUPER) },
            relations: { permissions: true }, 
        });
        
        return result.map(role => toRoleDto(role));
    }

    async updatePrivileges(data: {roleId: number; permissions: string[]}): Promise<RoleDto> {
        const {
            roleId,
            permissions,
        } = data;

        const result = await this.entityManager.transaction(async (trx) => {
            const findRole = await trx.findOne(Role, {
                where: { id: roleId },
                relations: { permissions: true },
            });

            if (!findRole) {
                throw new NotFoundException(`role ${roleId} not exist`);
            }

            const findPermissions = await trx.find(Permission, { where: permissions.map((p) => ({ permission: p })) });

            findRole.permissions = findPermissions;

            return await trx.save(findRole);
        });

        return toRoleDto(result);
    }
}


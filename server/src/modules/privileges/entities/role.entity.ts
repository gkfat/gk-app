import { EnumRole } from 'src/enums';
import { Account } from 'src/modules/accounts/entities/account.entity';
import {
    Column,
    Entity,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';

import { RolePermission } from './role-permission.entity';

@Entity()
export class Role {
    constructor(role: Partial<Role>) {
        Object.assign(this, role);
    }

    @PrimaryGeneratedColumn()
    @ApiProperty()
        id: number;

    @Column({
        unique: true, enum: EnumRole, 
    })
    @ApiProperty({ enum: EnumRole })
        role: EnumRole;

    @ManyToMany(() => Account, (account) => account.roles)
        accounts: Account[];

    @OneToMany(() => RolePermission, (rolePermission) => rolePermission.role, {
        cascade: true, onDelete: 'CASCADE', 
    })
        permissions: RolePermission[];
}
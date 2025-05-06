import { EnumRole } from 'src/enums';
import { Account } from 'src/modules/accounts/entities/account.entity';
import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';

import { Permission } from './permission.entity';

@Entity()
export class Role {
    constructor(role: Partial<Role>) {
        Object.assign(this, role);
    }

    @PrimaryGeneratedColumn()
        id: number;

    @Column({
        unique: true, enum: EnumRole, 
    })
        role: EnumRole;

    @ManyToMany(() => Account, (account) => account.roles)
        accounts: Account[];

    @ManyToMany(() => Permission, (permission) => permission.roles, {
        cascade: true, onDelete: 'CASCADE', 
    })
    @JoinTable({ name: 'role_permission' })
        permissions: Permission[];
}
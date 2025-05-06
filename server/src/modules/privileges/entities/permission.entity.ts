import {
    Column,
    Entity,
    ManyToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';

import { Role } from './role.entity';

@Entity()
export class Permission {
    constructor(data: Partial<Permission>) {
        Object.assign(this, data);
    }

    @PrimaryGeneratedColumn()
        id: number;

    @Column({
        unique: true,
        type: 'varchar',
    })
        permission: string;

    @Column({
        type: 'varchar', nullable: true, 
    })
        description: string;

    @ManyToMany(() => Role, (role) => role.permissions)
        roles: Role[];
}

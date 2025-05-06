import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

import {
    ApiProperty,
    ApiSchema,
} from '@nestjs/swagger';

import { Role } from './role.entity';

@ApiSchema({ name: 'RolePermissionDto' })
@Entity()
export class RolePermission {
    constructor(data: Partial<RolePermission>) {
        Object.assign(this, data);
    }

    @PrimaryGeneratedColumn()
    @ApiProperty()
        id: number;

    @Column({ type: 'bigint' })
        role_id: number;

    @Column({
        unique: true,
        type: 'varchar',
    })
    @ApiProperty({ type: 'string' })
        permission: string;
        
    @ManyToOne(() => Role, (role) => role.permissions, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'role_id' })
        role: Role;
}

import { EnumRoles } from 'src/enums/roles.enum';
import { Account } from 'src/modules/accounts/entities/account.entity';
import {
    Column,
    Entity,
    ManyToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';

import {
    ApiProperty,
    ApiSchema,
} from '@nestjs/swagger';

@ApiSchema({ name: 'RoleDto' })
@Entity()
export class Role {
    constructor(role: Partial<Role>) {
        Object.assign(this, role);
    }

    @PrimaryGeneratedColumn()
    @ApiProperty()
        id: number;

    @Column({
        unique: true, enum: EnumRoles, 
    })
    @ApiProperty({ enum: EnumRoles })
        role: string;

    @ManyToMany(() => Account, (account) => account.roles)
        accounts: Account[];
}
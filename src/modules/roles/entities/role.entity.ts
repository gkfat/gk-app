import { Account } from 'src/modules/accounts/entities/account.entity';
import {
    Column,
    Entity,
    ManyToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Role {
    constructor(role: Partial<Role>) {
        Object.assign(this, role);
    }

    @PrimaryGeneratedColumn()
        id: number;

    @Column({ unique: true })
        role: string;

    @ManyToMany(() => Account, (account) => account.roles)
        accounts: Account[];
}
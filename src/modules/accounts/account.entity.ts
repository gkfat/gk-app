import { Role } from 'src/modules/roles/role.entity';
import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';

import { AccountAuth } from './account-auth.entity';

@Entity()
export class Account {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    name: string;

    @Column()
    enabled: boolean;

    @Column({nullable: true})
    last_login_at: Date;

    @Column()
    create_at: Date;

    @Column({nullable: true})
    update_at: Date;

    @Column({nullable: true})
    delete_at: Date;

    @ManyToMany(() => Role, (role) => role.accounts, {cascade: true})
    @JoinTable({ name: 'account_role'})
    roles: Role[];

    @OneToMany(() => AccountAuth, (auth) => auth.account, {cascade: true})
    auths: AccountAuth[];
}


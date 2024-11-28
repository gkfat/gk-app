import { Role } from 'src/modules/roles/entities/role.entity';
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import { AccountAuth } from './account-auth.entity';

@Entity()
export class Account {
    constructor(account: Partial<Account>) {
        Object.assign(this, account);
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    name: string;

    @Column({default: false})
    enabled: boolean;

    @Column({nullable: true})
    last_login_at: Date;

    @CreateDateColumn()
    create_at: Date;

    @UpdateDateColumn({nullable: true})
    update_at: Date;

    @DeleteDateColumn({nullable: true})
    delete_at: Date;

    @ManyToMany(() => Role, (role) => role.accounts, {cascade: true})
    @JoinTable({ name: 'account_role'})
    roles: Role[];

    @OneToMany(() => AccountAuth, (auth) => auth.account, {cascade: true})
    auths: AccountAuth[];
}


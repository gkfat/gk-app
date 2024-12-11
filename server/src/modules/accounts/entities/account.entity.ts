import { Portfolio } from 'src/modules/portfolios/enities/portfolio.entity';
import { Role } from 'src/modules/roles/entities/role.entity';
import {
    Column,
    CreateDateColumn,
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

    @Column({ unique: true })
        email: string;

    @Column()
        name: string;

    @Column({ nullable: true })
        avatar: string;

    @Column({ default: true })
        enabled: boolean;

    @Column({
        nullable: true, default: null, 
    })
        last_login_at: Date;

    @CreateDateColumn()
        create_at: Date;

    @UpdateDateColumn({
        nullable: true, default: null, 
    })
        update_at: Date;

    @ManyToMany(() => Role, (role) => role.accounts, { cascade: true })
    @JoinTable({ name: 'account_role' })
        roles: Role[];

    @OneToMany(() => AccountAuth, (auth) => auth.account, { cascade: true })
        auths: AccountAuth[];

    @OneToMany(() => Portfolio, (portfolio) => portfolio.account, { cascade: true })
        portfolios: Portfolio[];
}


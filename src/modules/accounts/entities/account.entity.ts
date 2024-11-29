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

    @Column({ unique: true })
        email: string;

    @Column()
        name: string;

    @Column({ default: false })
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

    @DeleteDateColumn({ nullable: true })
        delete_at: Date;

    @ManyToMany(() => Role, (role) => role.accounts, { cascade: true })
    @JoinTable({ name: 'account_role' })
        roles: Role[];

    @OneToMany(() => AccountAuth, (auth) => auth.account, { cascade: true })
        auths: AccountAuth[];
}


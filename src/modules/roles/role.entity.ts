import { Account } from 'src/modules/accounts/account.entity';
import {
    Column,
    Entity,
    ManyToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    role: string;

    @ManyToMany(() => Account, (account) => account.roles)
    accounts: Account[];
}
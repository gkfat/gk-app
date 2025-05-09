import { Account } from 'src/modules/accounts/entities/account.entity';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ScheduledApi {
    constructor(data: Partial<ScheduledApi>) {
        Object.assign(this, data);
    }

    @PrimaryGeneratedColumn()
        id: number;

    @Column({ type: 'bigint' })
        account_id: number;

    @Column()
        api_url: string;

    @Column({ nullable: true })
        description: string;

    /**
     * 執行 interval (毫秒)
     */
    @Column()
        interval: number;

    @Column({ default: false })
        is_active: boolean;

    @ManyToOne(() => Account, (account) => account.auths, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'account_id' })
        account: Account;
}


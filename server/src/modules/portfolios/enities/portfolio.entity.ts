import { Account } from 'src/modules/accounts/entities/account.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';

import { TradeRecord } from './trade-record.entity';

@Entity()
export class Portfolio {
    constructor(data: Partial<Portfolio>) {
        Object.assign(this, data);
    }

    @ApiProperty()
    @CreateDateColumn()
        create_at: Date;

    @ApiProperty()
    @UpdateDateColumn({
        nullable: true, default: null, 
    })
        update_at: Date;

    @ApiProperty()
    @PrimaryGeneratedColumn()
        id: number;

    @ApiProperty()
    @Column({ nullable: false })
        title: string;

    @ApiProperty()
    @Column({ type: 'bigint' })
        account_id: number;

    @ApiProperty()
    @Column()
        initial_balance: number;

    @ManyToOne(() => Account, (account) => account.portfolios)
    @JoinColumn({ name: 'account_id' })
        account: Account;

    @ApiProperty({ type: [TradeRecord] })
    @OneToMany(() => TradeRecord, (tradeRecord) => tradeRecord.portfolio, { cascade: true })
        tradeRecords: TradeRecord[];
}


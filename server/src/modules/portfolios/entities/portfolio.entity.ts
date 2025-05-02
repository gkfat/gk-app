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

import {
    CashTradeRecord,
    FXTradeRecord, StockTradeRecord, 
} from './trade-record.entity';

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
    @Column({ type: 'date' })
        create_date: string;

    @ApiProperty()
    @Column({ type: 'bigint' })
        account_id: number;

    @ApiProperty({ description: '幣別' })
    @Column()
        currency: string;

    @ManyToOne(() => Account, (account) => account.portfolios)
    @JoinColumn({ name: 'account_id' })
        account: Account;

    @ApiProperty({ type: [CashTradeRecord] })
    @OneToMany(() => CashTradeRecord, (record) => record.portfolio, {
        cascade: true, onDelete: 'CASCADE', 
    })
        cashTradeRecords: CashTradeRecord[];

    @ApiProperty({ type: [StockTradeRecord] })
    @OneToMany(() => StockTradeRecord, (record) => record.portfolio, {
        cascade: true, onDelete: 'CASCADE', 
    })
        stockTradeRecords: StockTradeRecord[];

    @ApiProperty({ type: [FXTradeRecord] })
    @OneToMany(() => FXTradeRecord, (record) => record.portfolio, {
        cascade: true, onDelete: 'CASCADE', 
    })
        fxTradeRecords: FXTradeRecord[];
}


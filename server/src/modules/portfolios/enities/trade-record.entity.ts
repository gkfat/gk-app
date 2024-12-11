import { EnumTradeDirection } from 'src/enums/trade-direction';
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import { Portfolio } from './portfolio.entity';

@Entity()
export class TradeRecord {
    constructor(auth: Partial<TradeRecord>) {
        Object.assign(this, auth);
    }

    @CreateDateColumn()
        create_at: Date;

    @UpdateDateColumn({
        nullable: true, default: null, 
    })
        update_at: Date;

    @DeleteDateColumn({ nullable: true })
        delete_at: Date;

    @PrimaryGeneratedColumn()
        id: number;

    @Column()
        symbol: string;

    @Column({ type: 'bigint' })
        portfolio_id: number;

    @Column()
        trade_date: Date;
    
    @Column({ enum: [EnumTradeDirection.BUY, EnumTradeDirection.SELL] })
        direction: string;

    @Column()
        execution_price: number;

    @Column()
        quantity: number;

    @Column()
        total_amount: number;

    @Column()
        commission: number;
    
    @Column()
        tax: number;

    @ManyToOne(() => Portfolio, (portfolio) => portfolio.tradeRecords)
    @JoinColumn({ name: 'portfolio_id' })
        portfolio: Portfolio;
}


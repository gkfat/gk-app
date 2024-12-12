import { EnumTradeDirection } from 'src/enums/trade-direction';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import {
    ApiProperty,
    ApiSchema,
} from '@nestjs/swagger';

import { Portfolio } from './portfolio.entity';

@ApiSchema({ name: 'TradeRecordDto' })
@Entity()
export class TradeRecord {
    constructor(auth: Partial<TradeRecord>) {
        Object.assign(this, auth);
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

    @ApiProperty({ description: '股票代號' })
    @Column()
        symbol: string;

    @Column({ type: 'bigint' })
        portfolio_id: number;

    @ApiProperty({ description: '交易日期' })
    @Column()
        trade_date: Date;
    
    @ApiProperty({
        description: '交易方向', enum: EnumTradeDirection, 
    })
    @Column({ enum: EnumTradeDirection })
        direction: string;

    @ApiProperty({ description: '交易價位' })
    @Column()
        execution_price: number;

    @ApiProperty({ description: '交易數量(股)' })
    @Column()
        quantity: number;

    @ApiProperty({ description: '交易總價 = 交易價位 * 交易數量' })
    @Column()
        total_amount: number;

    @ApiProperty({ description: '手續費' })
    @Column()
        commission: number;
    
    @ApiProperty({ description: '稅' })
    @Column()
        tax: number;

    @ManyToOne(() => Portfolio, (portfolio) => portfolio.tradeRecords)
    @JoinColumn({ name: 'portfolio_id' })
        portfolio: Portfolio;
}


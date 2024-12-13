import {
    EnumAssetType,
    EnumTradeDirection,
    EnumCashFlow,
} from 'src/enums';
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

@ApiSchema({ name: 'CashTradeRecordDto' })
@Entity()
export class CashTradeRecord {
    constructor(data: Partial<CashTradeRecord>) {
        Object.assign(this, data);
    }

    @ApiProperty()
    @PrimaryGeneratedColumn()
        id: number;
        
    @ApiProperty()
    @CreateDateColumn()
        create_at: Date;

    @ApiProperty()
    @UpdateDateColumn({
        nullable: true, default: null, 
    })
        update_at: Date;

    @Column({ type: 'bigint' })
    @ApiProperty()
        portfolio_id: number;

    @ApiProperty({ description: '資產類型' })
    @Column({ enum: EnumAssetType })
        asset_type: EnumAssetType;

    @ApiProperty({
        description: '存入/領回', enum: EnumCashFlow, 
    })
    @Column({ enum: EnumCashFlow })
        direction: EnumCashFlow;
            
    @ApiProperty({ description: '手續費' })
    @Column()
        commission: number;

    @ApiProperty({ description: '交易日期' })
    @Column({ type: 'date' })
        trade_date: string;

    @ApiProperty({ description: '交易數量' })
    @Column()
        quantity: number;

    @ManyToOne(() => Portfolio, (portfolio) => portfolio.stockTradeRecords)
    @JoinColumn({ name: 'portfolio_id' })
        portfolio: Portfolio;
}

@ApiSchema({ name: 'StockTradeRecordDto' })
@Entity()
export class StockTradeRecord {
    constructor(data: Partial<StockTradeRecord>) {
        Object.assign(this, data);
    }

    @ApiProperty()
    @PrimaryGeneratedColumn()
        id: number;
        
    @ApiProperty()
    @CreateDateColumn()
        create_at: Date;

    @ApiProperty()
    @UpdateDateColumn({
        nullable: true, default: null, 
    })
        update_at: Date;

    @Column({ type: 'bigint' })
    @ApiProperty()
        portfolio_id: number;

    @ApiProperty({ description: '資產類型' })
    @Column({ enum: EnumAssetType })
        asset_type: EnumAssetType;
            
    @ApiProperty({
        description: '買進/賣出', enum: EnumTradeDirection, 
    })
    @Column({ enum: EnumTradeDirection })
        direction: EnumTradeDirection;
        
    @ApiProperty({ description: '交易日期' })
    @Column({ type: 'date' })
        trade_date: string;

    @ApiProperty({ description: '手續費' })
    @Column()
        commission: number;
    
    @ApiProperty({ description: '稅' })
    @Column()
        tax: number;

    @ApiProperty({ description: '股票代號' })
    @Column()
        symbol: string;

    @ApiProperty({ description: '交易價位' })
    @Column()
        execution_price: number;

    @ApiProperty({ description: '交易數量(股)' })
    @Column()
        quantity: number;

    @ApiProperty({ description: '成本' })
    @Column()
        cost: number;

    @ApiProperty({ description: '已實現損益' })
    @Column()
        realized_profit_loss: number;

    @ManyToOne(() => Portfolio, (portfolio) => portfolio.stockTradeRecords)
    @JoinColumn({ name: 'portfolio_id' })
        portfolio: Portfolio;
}

@ApiSchema({ name: 'FXTradeRecordDto' })
@Entity()
export class FXTradeRecord {
    constructor(data: Partial<FXTradeRecord>) {
        Object.assign(this, data);
    }

    @ApiProperty()
    @PrimaryGeneratedColumn()
        id: number;

    @ApiProperty()
    @CreateDateColumn()
        create_at: Date;

    @ApiProperty()
    @UpdateDateColumn({
        nullable: true, default: null, 
    })
        update_at: Date;
        
    @Column({ type: 'bigint' })
    @ApiProperty()
        portfolio_id: number;

    @ApiProperty({ description: '資產類型' })
    @Column({ enum: EnumAssetType })
        asset_type: EnumAssetType;
            
    @ApiProperty({
        description: '買進/賣出', enum: EnumTradeDirection, 
    })
    @Column({ enum: EnumTradeDirection })
        direction: EnumTradeDirection;
        
    @ApiProperty({ description: '交易日期' })
    @Column({ type: 'date' })
        trade_date: string;

    @ApiProperty({ description: '手續費' })
    @Column()
        commission: number;
    
    @ApiProperty({ description: '稅' })
    @Column()
        tax: number;

    @ApiProperty({ description: '本金幣別' })
    @Column()
        base_currency: string;

    @ApiProperty({ description: '交易幣別' })
    @Column()
        target_currency: string;

    @ApiProperty({ description: '匯率' })
    @Column()
        exchange_rate: number;

    @ApiProperty({ description: '本金幣別數量' })
    @Column()
        base_quantity: number;

    @ApiProperty({ description: '目標幣別數量' })
    @Column()
        target_quantity: number;

    @ApiProperty({ description: '成本(本金幣別)' })
    @Column()
        cost: number;

    @ApiProperty({ description: '已實現損益' })
    @Column()
        realized_profit_loss: number;

    @ManyToOne(() => Portfolio, (portfolio) => portfolio.fxTradeRecords)
    @JoinColumn({ name: 'portfolio_id' })
        portfolio: Portfolio;
}

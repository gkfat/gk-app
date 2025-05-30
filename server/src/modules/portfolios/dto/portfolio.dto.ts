import _ from 'lodash';
import { EnumAssetType } from 'src/enums';

import {
    ApiProperty,
    ApiSchema,
    OmitType,
} from '@nestjs/swagger';

import { Portfolio } from '../entities/portfolio.entity';
import {
    CashTradeRecord,
    FXTradeRecord,
    StockTradeRecord,
} from '../entities/trade-record.entity';

@ApiSchema({ name: 'PositionDto' })
export class PositionDto {
    constructor(data: Partial<PositionDto>) {
        Object.assign(this, data);
    }

    @ApiProperty({
        description: '資產類型', enum: EnumAssetType, 
    })
        assetType: EnumAssetType;
}

@ApiSchema({ name: 'CashFlowDto ' })
export class CashFlowDto {
    @ApiProperty({
        type: [Number], description: '現金流數值', 
    })
        flows: number[];

    @ApiProperty({
        type: [String], description: '現金流標籤', 
    })
        labels: string[];
}

@ApiSchema({ name: 'CashPositionDto' })
export class CashPositionDto extends PositionDto {
    constructor(data: Partial<CashPositionDto>) {
        super(data);
        Object.assign(this, data);
    }

    @ApiProperty({ description: '初始資金' })
        initialBalance: number;

    @ApiProperty({ description: '剩餘資金' })
        quantity: number;

    @ApiProperty({
        description: '現金流', type: CashFlowDto, 
    })
        cashFlow: {
            flows: number[];
            labels: string[];  
        };

    @ApiProperty({
        description: '交易紀錄', type: [CashTradeRecord], 
    })
        tradeRecords: CashTradeRecord[];
}

@ApiSchema({ name: 'StockPositionDto' })
export class StockPositionDto extends PositionDto {
    constructor(data: Partial<StockPositionDto>) {
        super(data);
        Object.assign(this, data);
    }

    @ApiProperty({ description: '股票代號' })
        symbol: string;

    @ApiProperty({ description: '持有總數量(股)' })
        totalQuantity: number;

    @ApiProperty({ description: '總成本' })
        totalCost: number;

    @ApiProperty({ description: '平均成本 = 總成本 / 總數量' })
        averageCost: number;

    @ApiProperty({ description: '已實現損益' })
        realizedProfitLoss: number;

    @ApiProperty({ description: '報酬率' })
        returnRate: number;

    @ApiProperty({
        description: '交易紀錄', type: [StockTradeRecord], 
    })
        tradeRecords: StockTradeRecord[];
}

@ApiSchema({ name: 'FXPositionDto' })
export class FXPositionDto extends PositionDto {
    constructor(data: Partial<FXPositionDto>) {
        super(data);
        Object.assign(this, data);
    }

    @ApiProperty({ description: '幣別' })
        currency: string;

    @ApiProperty({ description: '持有總數量' })
        totalQuantity: number;

    @ApiProperty({ description: '總成本' })
        totalCost: number;

    @ApiProperty({ description: '平均成本' })
        averageCost: number;

    @ApiProperty({ description: '已實現損益(本金幣別)' })
        realizedProfitLoss: number;

    @ApiProperty({
        description: '交易紀錄', type: [FXTradeRecord],  
    })
        tradeRecords: FXTradeRecord[];
}

@ApiSchema({ name: 'PortfolioDto' })
export class PortfolioDto extends OmitType(Portfolio, [
    'stockTradeRecords',
    'cashTradeRecords',
    'fxTradeRecords',
] as const) {
    constructor(data: Partial<PortfolioDto>) {
        super();

        Object.assign(this, _.omit(data, [
            'stockTradeRecords',
            'cashTradeRecords',
            'fxTradeRecords',
        ]));
    }

    @ApiProperty({ description: '總成本' })
        costBasis: number;

    @ApiProperty({ description: '總損益 = 市值 - 初始資金 + 現金資產餘額' })
        totalProfitLoss: number;

    @ApiProperty({ description: '已實現損益' })
        realizedProfitLoss: number;

    @ApiProperty({
        description: '現金部位', type: [CashPositionDto], 
    })
        cashPositions: CashPositionDto[];
        
    @ApiProperty({
        description: '股票部位', type: [StockPositionDto], 
    })
        stockPositions: StockPositionDto[];

    @ApiProperty({
        description: '外匯部位', type: [FXPositionDto], 
    })
        fxPositions: FXPositionDto[];
}


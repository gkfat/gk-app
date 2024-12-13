import {
    ApiProperty,
    ApiSchema,
    getSchemaPath,
} from '@nestjs/swagger';

import { Portfolio } from '../enities/portfolio.entity';
import { EnumAssetType } from 'src/enums';
import {
    CashTradeRecord, FXTradeRecord, StockTradeRecord, 
} from '../enities/trade-record.entity';
export class PositionDto {
    constructor(data: Partial<PositionDto>) {
        Object.assign(this, data);
    }

    @ApiProperty({
        description: '資產類型', enum: EnumAssetType, 
    })
        assetType: EnumAssetType;
}

@ApiSchema({ name: 'CashPositionDto' })
export class CashPositionDto extends PositionDto {
    constructor(data: Partial<CashPositionDto>) {
        super(data);
        Object.assign(this, data);
    }

    @ApiProperty({ description: '持有數量' })
        quantity: number;

    @ApiProperty({ description: '交易紀錄' })
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

    @ApiProperty({ description: '交易紀錄' })
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

    @ApiProperty({ description: '交易紀錄' })
        tradeRecords: FXTradeRecord[];
}

@ApiSchema({ name: 'PortfolioDto' })
export class PortfolioDto extends Portfolio {
    @ApiProperty({ description: '總成本' })
        costBasis: number;

    @ApiProperty({ description: '已實現損益' })
        realizedProfitLoss: number;

    @ApiProperty({
        description: '持有部位',
        type: 'array',
        items: {
            oneOf: [
                { $ref: getSchemaPath(CashPositionDto) },
                { $ref: getSchemaPath(StockPositionDto) },
                { $ref: getSchemaPath(FXPositionDto) },
            ],
        },
    })
        positions: (CashPositionDto | StockPositionDto | FXPositionDto)[];
}


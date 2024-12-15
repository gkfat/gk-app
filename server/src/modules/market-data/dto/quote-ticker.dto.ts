import {
    EnumMarketType,
    EnumTickerType,
} from 'src/enums/market-data.enum';

import {
    ApiProperty,
    ApiSchema,
} from '@nestjs/swagger';

@ApiSchema({ name: 'QuoteTickerDto' })
export class QuoteTicker {
    constructor(data: Partial<QuoteTicker>) {
        Object.assign(this, data);
    }

    @ApiProperty({ example: '2024-12-11' })
        date: string;

    @ApiProperty({
        description: 'Ticker 類型', example: EnumTickerType.EQUITY, 
    })
        type: EnumTickerType;

    @ApiProperty({
        description: '交易所', example: 'TWSE', 
    })
        exchange: string;

    @ApiProperty({
        description: '市場別', example: EnumMarketType.TSE, 
    })
        market: EnumMarketType;
            
    @ApiProperty({
        description: '股票代號', example: '2330', 
    })
        symbol: string;

    @ApiProperty({
        description: '股票名稱', example: '台積電', 
    })
        name: string;

    @ApiProperty({ description: '現價' })
        lastPrice: string;

    @ApiProperty({ description: '最後更新時間' })
        lastUpdated: number;
}
import {
    EnumMarketType,
    EnumTickerType,
} from 'src/enums/market-data.enum';

import {
    ApiProperty,
    ApiSchema,
} from '@nestjs/swagger';

@ApiSchema({ name: 'TickerDto' })
export class TickerDto {
    constructor(data: Partial<TickerDto>) {
        Object.assign(this, data);
    }
    
    @ApiProperty({ example: '2330' })
        symbol: string;

    @ApiProperty({ example: '台積電' })
        name: string;
}

@ApiSchema({ name: 'GetTickersResponse' })
export class GetTickersDto {
    constructor(data: Partial<GetTickersDto>) {
        Object.assign(this, data);
    }

    @ApiProperty({
        description: '查詢日期', example: '2024-12-11', 
    })
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

    @ApiProperty({ type: [TickerDto] })
        tickers: TickerDto[];
}
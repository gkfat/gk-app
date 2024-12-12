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
export class GetTickersResponse {
    @ApiProperty({ example: '2024-12-11' })
        date: string;

    @ApiProperty({ example: 'EQUITY' })
        type: string;

    @ApiProperty({ example: 'TWSE' })
        exchange: string;

    @ApiProperty({ type: [TickerDto] })
        tickers: TickerDto[];
}
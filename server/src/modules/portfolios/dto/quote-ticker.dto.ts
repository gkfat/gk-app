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

    @ApiProperty({ example: 'EQUITY' })
        type: string;

    @ApiProperty({ example: 'TWSE' })
        exchange: string;
            
    @ApiProperty({
        description: '股票代號', example: '2330', 
    })
        symbol: string;

    @ApiProperty({
        description: '股票名稱', example: '台積電', 
    })
        name: string;

    @ApiProperty({ description: '開盤價' })
        openPrice: number;
    
    @ApiProperty({ description: '收盤價' })
        closePrice: number;

    @ApiProperty({ description: '現價' })
        lastPrice: number;

    @ApiProperty({ description: '最後更新時間' })
        lastUpdated: number;
}
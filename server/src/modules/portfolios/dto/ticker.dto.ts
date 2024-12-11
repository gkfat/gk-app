import {
    ApiProperty,
    ApiSchema,
} from '@nestjs/swagger';

@ApiSchema({ name: 'GetTickerResponse' })
export class TickerDto {
    constructor(data: Partial<TickerDto>) {
        Object.assign(this, data);
    }

    @ApiProperty({ example: '2024-12-11' })
        date: string;

    @ApiProperty({ example: 'EQUITY' })
        type: string;

    @ApiProperty({ example: 'TWSE' })
        exchange: string;
    
    @ApiProperty()
        name: string;

    @ApiProperty({ name: '開盤價' })
        openPrice: number;
    
    @ApiProperty({ name: '收盤價' })
        closePrice: number;

    @ApiProperty({ name: '現價' })
        lastPrice: number;

    @ApiProperty({ name: '最後更新時間' })
        lastUpdated: number;
}
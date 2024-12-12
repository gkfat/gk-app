import {
    IsDateString,
    IsNotEmpty,
    IsNumber,
    IsString,
} from 'class-validator';
import { EnumTradeDirection } from 'src/enums';

import {
    ApiProperty,
    ApiSchema,
} from '@nestjs/swagger';

@ApiSchema({ name: 'CreateTradeRecordRequest' })
export class CreateTradeRecordDto {
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ description: 'Portfolio Id' })
        portfolioId: number;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: 'ticker id', example: '2330', 
    })
        symbol: string;

    @IsDateString()
    @IsNotEmpty()
    @ApiProperty({ description: '交易日期' })
        tradeDate: Date;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: '買進/賣出', enum: [EnumTradeDirection.BUY, EnumTradeDirection.SELL], 
    })
        direction: string;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ description: '成交價格' })
        executionPrice: number;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ description: '成交數量(股)' })
        quantity: number;
        
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ description: '手續費' })
        commission: number;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ description: '稅' })
        tax: number;
}


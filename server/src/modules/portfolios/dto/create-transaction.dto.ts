import {
    IsDateString,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsString,
} from 'class-validator';
import {
    EnumAssetType,
    EnumCashFlow,
    EnumTradeDirection,
} from 'src/enums';

import {
    ApiProperty,
    ApiSchema,
    getSchemaPath,
} from '@nestjs/swagger';

@ApiSchema({ name: 'CashTransactionDto' })
export class CashTransactionDto {
    @IsEnum(EnumCashFlow)
    @IsNotEmpty()
    @ApiProperty({
        description: '提領 / 存入',
        enum: EnumCashFlow,
    })
        direction: EnumCashFlow;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ description: '數量' })
        quantity: number;
}

@ApiSchema({ name: 'StockTransactionDto' })
export class StockTransactionDto {
    @IsEnum(EnumTradeDirection)
    @IsNotEmpty()
    @ApiProperty({
        description: '買賣方向 / 進出',
        enum: EnumTradeDirection,
    })
        direction: EnumTradeDirection;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: 'ticker id', example: '2330',
    })
        symbol: string;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ description: '成交價格' })
        executionPrice: number;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ description: '成交數量(股)' })
        quantity: number;
}

@ApiSchema({ name: 'FXTransactionDto' })
export class FXTransactionDto {
    @IsEnum(EnumTradeDirection)
    @IsNotEmpty()
    @ApiProperty({
        description: '買賣方向 / 進出',
        enum: EnumTradeDirection,
    })
        direction: EnumTradeDirection;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: '本金幣別', example: 'TWD', 
    })
        baseCurrency: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: '目標幣別', example: 'USD', 
    })
        targetCurrency: string;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ description: '匯率' })
        exchangeRate: number;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ description: '本金幣別數量' })
        baseQuantity: number;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ description: '交易幣別數量' })
        targetQuantity: number;
}

@ApiSchema({ name: 'CreateTransactionRequest' })
export class CreateTransactionDto {
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
        portfolioId: number;

    @IsDateString()
    @IsNotEmpty()
    @ApiProperty({ description: '交易日期' })
        tradeDate: string;

    @IsEnum(EnumAssetType)
    @IsNotEmpty()
    @ApiProperty({
        enum: EnumAssetType, description: '資產類型', 
    })
        assetType: EnumAssetType;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ description: '手續費' })
        commission: number;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ description: '稅' })
        tax: number;
        
    @IsNotEmpty()
    @ApiProperty({
        description: '交易細節',
        oneOf: [
            { $ref: getSchemaPath(StockTransactionDto) },
            { $ref: getSchemaPath(FXTransactionDto) },
            { $ref: getSchemaPath(CashTransactionDto) },
        ],
    })
        detail: StockTransactionDto | FXTransactionDto | CashTransactionDto;
}

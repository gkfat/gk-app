import { IsNumber } from 'class-validator';

import {
    ApiProperty,
    ApiSchema,
} from '@nestjs/swagger';

import { Portfolio } from '../enities/portfolio.entity';

@ApiSchema({ name: 'PortfolioDto' })
export class PortfolioDto extends Portfolio {
    @IsNumber()
    @ApiProperty({ description: '未實現損益' })
        unrealized_gain_loss: number;

    @IsNumber()
    @ApiProperty({ description: '已實現損益' })
        realized_profit_loss: number;

    @IsNumber()
    @ApiProperty({ description: '總成本(買入總價+手續費+賣出稅加總)' })
        total_cost: number;
}


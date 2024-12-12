import {
    ApiProperty,
    ApiSchema,
} from '@nestjs/swagger';

import { Portfolio } from '../enities/portfolio.entity';

@ApiSchema({ name: 'PortfolioDto' })
export class PortfolioDto extends Portfolio {
    @ApiProperty({ description: '投資標的的總市值' })
        market_value: number;

    @ApiProperty({ description: '投資標的總成本' })
        cost_basis: number;

    @ApiProperty({ description: '未實現損益(市值加總-賣出成本加總)' })
        unrealized_profit_loss: number;

    @ApiProperty({ description: '已實現損益(賣出價加總-賣出成本加總)' })
        realized_profit_loss: number;
}


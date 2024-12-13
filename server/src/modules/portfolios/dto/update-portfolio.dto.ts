import { IsString } from 'class-validator';

import {
    ApiProperty,
    ApiSchema,
} from '@nestjs/swagger';

@ApiSchema({ name: 'UpdatePortfolioRequest' })
export class UpdatePortfolioDto {
    @IsString()
    @ApiProperty({
        required: false, description: 'name of the portfolio', 
    })
        title?: string;
}
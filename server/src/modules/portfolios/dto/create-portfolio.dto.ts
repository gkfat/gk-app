import {
    IsNotEmpty,
    IsNumber,
    IsString,
} from 'class-validator';

import {
    ApiProperty,
    ApiSchema,
} from '@nestjs/swagger';

@ApiSchema({ name: 'CreatePortfolioRequest' })
export class CreatePortfolioDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'name of the portfolio' })
        title: string;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ description: 'Initial balance of portfolio' })
        initialBalance: number;

}
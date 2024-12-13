import {
    IsDateString,
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

    @IsDateString()
    @IsNotEmpty()
    @ApiProperty({ description: 'init date of the portfolio' })
        createDate: string;
            
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'base currency of the portfolio' })
        currency: string;
            
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ description: 'Initial balance of portfolio' })
        initialBalance: number;
}
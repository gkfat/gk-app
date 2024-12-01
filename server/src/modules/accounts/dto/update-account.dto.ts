import { IsString } from 'class-validator';

import {
    ApiProperty,
    ApiSchema,
} from '@nestjs/swagger';

@ApiSchema({ name: 'UpdateAccountRequest' })
export class UpdateAccountDto {
    @IsString()
    @ApiProperty()
        name: string;

    @IsString()
    @ApiProperty()
        password: string;
}
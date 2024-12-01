import {
    IsEmail,
    IsString,
} from 'class-validator';

import {
    ApiProperty,
    ApiSchema,
} from '@nestjs/swagger';

@ApiSchema({ name: 'CreateAccountRequest' })
export class CreateAccountDto {
    @IsEmail()
    @ApiProperty({ description: 'Unique key of account' })
        email: string;

    @IsString()
    @ApiProperty()
        name: string;

    @IsString()
    @ApiProperty()
        password: string;
}
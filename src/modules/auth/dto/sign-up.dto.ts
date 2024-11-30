import {
    IsEmail,
    IsNotEmpty,
    IsString,
} from 'class-validator';

import {
    ApiProperty,
    ApiSchema,
} from '@nestjs/swagger';

@ApiSchema({ name: 'SignUpRequest' })
export class SignUpDto {
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({ description: 'Unique key of account' })
        email: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
        name: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
        password: string;
}
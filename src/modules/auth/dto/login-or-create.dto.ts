import {
    IsEmail,
    IsNotEmpty,
    IsString,
} from 'class-validator';
import { LoginType } from 'src/enums/login-type.enum';

import {
    ApiProperty,
    ApiSchema,
} from '@nestjs/swagger';

@ApiSchema({ name: 'LoginRequest' })
export class LoginOrCreateDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        type: 'string', enum: LoginType, 
    })
        type: typeof LoginType[keyof typeof LoginType];

    @IsEmail()
    @IsNotEmpty()
    @ApiProperty()
        email: string;

    @ApiProperty({
        required: false, description: 'required when using password type', 
    })
        password: string;

    @ApiProperty({
        required: false, description: 'required when not using password login type', 
    })
        idToken?: string;
}
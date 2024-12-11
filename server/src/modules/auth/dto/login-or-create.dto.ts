import {
    IsEmail,
    IsNotEmpty,
    IsString,
    ValidateIf,
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

    @ValidateIf((o) => o.type === LoginType.PASSWORD)
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({
        required: false, description: 'required when using password type',
        example: 'super@got2do.com',
    })
        email?: string;

    @ValidateIf((o) => o.type === LoginType.PASSWORD)
    @IsNotEmpty()
    @ApiProperty({
        required: false, description: 'required when using password type', 
        example: 'super',
    })
        password?: string;

    @ValidateIf((o) => o.type === LoginType.GOOGLE)
    @IsNotEmpty()
    @ApiProperty({
        required: false, description: 'required when using google login type', 
    })
        code?: string;
}
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
    })
        email?: string;

    @ValidateIf((o) => o.type === LoginType.PASSWORD)
    @IsNotEmpty()
    @ApiProperty({
        required: false, description: 'required when using password type', 
    })
        password?: string;

    @ValidateIf((o) => o.type === LoginType.GOOGLE)
    @IsNotEmpty()
    @ApiProperty({
        required: false, description: 'required when not using password login type', 
    })
        idToken?: string;
}
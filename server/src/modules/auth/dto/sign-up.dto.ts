import {
    IsEmail,
    IsNotEmpty,
    IsString,
    Matches,
    MaxLength,
    MinLength,
} from 'class-validator';

import {
    ApiProperty,
    ApiSchema,
} from '@nestjs/swagger';

@ApiSchema({ name: 'SendVerificationCodeRequest' })
export class SendVerificationCodeDto {
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({
        description: 'Unique key of account', example: 'super@gkapp.com', 
    })
        email: string;
}

@ApiSchema({ name: 'VerifyCodeRequest' })
export class VerifyCodeDto {
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({
        description: 'Unique key of account', example: 'super@gkapp.com', 
    })
        email: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'verification code received from email' })
        verificationCode: string;
}

@ApiSchema({ name: 'SignUpRequest' })
export class SignUpDto {
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({
        description: 'Unique key of account', example: 'super@gkapp.com', 
    })
        email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(1)
    @MaxLength(20)
    @ApiProperty({ description: 'At least 1, most 20 characters' })
        name: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(4)
    @MaxLength(10)
    @Matches(/^[A-Za-z0-9]{4,10}$/, { message: 'Must use only a-z or 0-9' })
    @ApiProperty({ description: 'At least 4, most 10 characters' })
        password: string;
}
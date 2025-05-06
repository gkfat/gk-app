import { IsArray } from 'class-validator';

import {
    ApiProperty,
    ApiSchema,
} from '@nestjs/swagger';

@ApiSchema({ name: 'UpdatePrivilegesRequestDto' })
export class UpdatePrivilegesRequestDto {
    @IsArray()
    @ApiProperty()
        permissions: string[];
}
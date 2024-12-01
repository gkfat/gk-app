import { IsArray } from 'class-validator';

import {
    ApiProperty,
    ApiSchema,
} from '@nestjs/swagger';

@ApiSchema({ name: 'UpdateAccountRolesRequest' })
export class UpdateAccountRolesDto {
    @IsArray()
    @ApiProperty()
        roleIds: number[];
}
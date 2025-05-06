import { IsArray } from 'class-validator';

import {
    ApiProperty,
    ApiSchema,
} from '@nestjs/swagger';

@ApiSchema({ name: 'UpdatePermissionsRequest' })
export class UpdatePermissionsRequestDto {
    @IsArray()
    @ApiProperty()
        permissions: string[];
}
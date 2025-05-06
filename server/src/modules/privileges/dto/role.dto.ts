import { EnumRole } from 'src/enums';

import {
    ApiProperty,
    ApiSchema,
} from '@nestjs/swagger';

import { PermissionDto } from './permission.dto';

@ApiSchema({ name: 'RoleDto' })
export class RoleDto {
    @ApiProperty()
        id: number;

    @ApiProperty({ enum: EnumRole })
        role: EnumRole;

    @ApiProperty({ type: [PermissionDto] })
        permissions: PermissionDto[];
}
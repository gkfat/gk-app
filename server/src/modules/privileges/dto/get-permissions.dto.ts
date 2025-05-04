import { EnumRole } from 'src/enums';

import {
    ApiProperty,
    ApiSchema,
} from '@nestjs/swagger';

@ApiSchema({ name: 'GetPermissionsResponse' })
export class GetPermissionsResponseDto {
    @ApiProperty({
        enum: EnumRole, description: 'role', 
    })
        role: EnumRole;

    @ApiProperty({
        type: [String],
        description: 'role permissions',
    })
        permissions: string[];
}
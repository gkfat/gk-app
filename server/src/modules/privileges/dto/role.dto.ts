import { EnumRole } from 'src/enums';

import {
    ApiProperty,
    ApiSchema,
} from '@nestjs/swagger';

@ApiSchema({ name: 'RoleDto' })
export class RoleDto {
    @ApiProperty()
        id: number;

    @ApiProperty({ enum: EnumRole })
        role: EnumRole;

    @ApiProperty({ type: [String] })
        permissions: string[];
}
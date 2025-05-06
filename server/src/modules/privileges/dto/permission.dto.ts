import {
    ApiProperty,
    ApiSchema,
} from '@nestjs/swagger';

@ApiSchema({ name: 'PermissionDto' })
export class PermissionDto {
    @ApiProperty()
        id: number;

    @ApiProperty()
        permission: string;

    @ApiProperty()
        description: string | null;
}
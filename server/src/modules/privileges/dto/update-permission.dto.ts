import {
    ApiProperty,
    ApiSchema,
} from '@nestjs/swagger';

@ApiSchema({ name: 'UpdatePermissionsRequest' })
export class UpdatePermissionRequestDto {
    @ApiProperty()
        description: string | null;
}
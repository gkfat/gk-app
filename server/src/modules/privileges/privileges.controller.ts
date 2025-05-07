import { OperationLog } from 'src/decorators/operation-log.decorators';
import { RequirePermissions } from 'src/decorators/require-permissions.decorators';
import { Permissions } from 'src/enums';
import { AuthGuard } from 'src/middlewares/auth.guard';
import { PermissionsGuard } from 'src/middlewares/permissions.guard';

import {
    Body,
    Controller,
    Get,
    Param,
    Put,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOkResponse,
} from '@nestjs/swagger';

import { PermissionDto } from './dto/permission.dto';
import { RoleDto } from './dto/role.dto';
import { UpdatePermissionRequestDto } from './dto/update-permission.dto';
import { UpdatePrivilegesRequestDto } from './dto/update-privileges.dto';
import { PrivilegesService } from './privileges.service';

@ApiBearerAuth('Authorization')
@Controller('privileges')
export class PrivilegesController {
    constructor(
        private readonly privilegesService: PrivilegesService,
    ) {}

    @Get('roles')
    @UseGuards(AuthGuard, PermissionsGuard)
    @RequirePermissions(Permissions.iam.roles.get)
    @ApiOkResponse({ type: [RoleDto] })
    async listRoles() {
        const result = await this.privilegesService.listRoles();

        return result;
    }

    @Get('permissions')
    @UseGuards(AuthGuard, PermissionsGuard)
    @RequirePermissions(Permissions.iam.permissions.get)
    @ApiOkResponse({ type: [PermissionDto] })
    async listPermissions() {
        const result = await this.privilegesService.listPermissions();

        return result;
    }

    @OperationLog()
    @Put(':permissionId/permission')
    @UseGuards(AuthGuard, PermissionsGuard)
    @RequirePermissions(Permissions.iam.permissions.update)
    @ApiOkResponse({ type: [PermissionDto] })
    async updatePermission(
        @Param('permissionId') permissionId: string,
        @Body() req: UpdatePermissionRequestDto,
    ) {
        const result = await this.privilegesService.updatePermission({
            permissionId: +permissionId,
            description: req.description,
        });

        return result;
    }

    @Get()
    @UseGuards(AuthGuard, PermissionsGuard)
    @RequirePermissions(Permissions.iam.privileges.get)
    @ApiOkResponse({ type: [RoleDto] })
    async listPrivileges() {
        const result = await this.privilegesService.listPrivileges();

        return result;
    }

    @OperationLog()
    @Put(':roleId/privileges')
    @UseGuards(AuthGuard, PermissionsGuard)
    @RequirePermissions(Permissions.iam.privileges.update)
    @ApiOkResponse({ type: RoleDto })
    @UseGuards(AuthGuard, PermissionsGuard)
    async updatePrivileges(
        @Param('roleId') roleId: string,
        @Body() req: UpdatePrivilegesRequestDto,
    ) {
        const result = await this.privilegesService.updatePrivileges({
            roleId: +roleId,
            permissions: req.permissions,
        });

        return result;
    }

}

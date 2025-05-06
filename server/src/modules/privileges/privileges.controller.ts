import { Response } from 'express';
import { OperationLog } from 'src/decorators/operation-log.decorators';
import { RequirePermissions } from 'src/decorators/require-permissions.decorators';
import { Permissions } from 'src/enums';
import { AuthGuard } from 'src/middlewares/auth.guard';
import { PermissionsGuard } from 'src/middlewares/permissions.guard';

import {
    Controller,
    Get,
    NotFoundException,
    Param,
    Put,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOkResponse,
} from '@nestjs/swagger';

import { RoleDto } from './dto/role.dto';
import { UpdatePermissionsRequestDto } from './dto/update-permissions.dto';
import { PrivilegesService } from './privileges.service';

@ApiBearerAuth('Authorization')
@Controller('privileges')
export class PrivilegesController {
    constructor(
        private readonly privilegesService: PrivilegesService,
    ) {}

    @Get('roles')
    @UseGuards(AuthGuard, PermissionsGuard)
    @RequirePermissions(Permissions.privilege.roles.get)
    @ApiOkResponse({ type: [RoleDto] })
    async listRoles(@Res() res: Response<RoleDto[]>) {
        const result = await this.privilegesService.listRoles();

        return res.json(result);
    }

    @Get('permissions')
    @UseGuards(AuthGuard, PermissionsGuard)
    @RequirePermissions(Permissions.privilege.permissions.get)
    @ApiOkResponse({ type: [RoleDto] })
    async listPermissions(@Res() res: Response<RoleDto[]>) {
        const result = await this.privilegesService.listPermissions();

        return res.json(result);
    }

    @OperationLog()
    @Put(':roleId/permissions')
    @UseGuards(AuthGuard, PermissionsGuard)
    @RequirePermissions(Permissions.privilege.permissions.update)
    @ApiOkResponse({ type: RoleDto })
    @UseGuards(AuthGuard, PermissionsGuard)
    async updatePermissions(
        @Param('roleId') roleId: string,
        @Req() req: UpdatePermissionsRequestDto,
        @Res() res: Response<RoleDto>,
    ) {
        const findRole = await this.privilegesService.findRole(+roleId);

        if (!findRole) {
            throw new NotFoundException('Role not found');
        }

        const result = await this.privilegesService.updatePermissions({
            roleId: +roleId,
            permissions: req.permissions,
        });

        return res.json(result);
    }

}

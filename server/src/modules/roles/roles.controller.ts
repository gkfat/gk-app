import { Response } from 'express';
import { RequirePermissions } from 'src/decorators/require-permissions.decorators';
import { Permissions } from 'src/enums/permissions';
import { AuthGuard } from 'src/middlewares/auth.guard';
import { PermissionsGuard } from 'src/middlewares/permissions.guard';

import {
    Controller,
    Get,
    Res,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { Role } from './entities/role.entity';
import { RolesService } from './roles.service';

@ApiBearerAuth('Authorization')
@Controller('roles')
export class RolesController {
    constructor(
        private readonly rolesService: RolesService,
    ) {}

    @Get()
    @UseGuards(AuthGuard, PermissionsGuard)
    @RequirePermissions(Permissions.privilege.roles.get)
    async list(@Res() res: Response<Role[]>) {
        const roles = await this.rolesService.findAll();

        return res.json(roles);
    }
}

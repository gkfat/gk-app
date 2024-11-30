import { Response } from 'express';

import {
    Controller,
    Get,
    Res,
    UseGuards,
} from '@nestjs/common';

import { AuthGuard } from '../auth/auth.guard';
import { Role } from './entities/role.entity';
import { RolesService } from './roles.service';

@Controller('roles')
export class RolesController {
    constructor(
        private readonly rolesService: RolesService,
    ) {}

    @UseGuards(AuthGuard)
    @Get()
    async list(@Res() res: Response<Role[]>) {
        const roles = await this.rolesService.findAll();

        return res.json(roles);
    }
}

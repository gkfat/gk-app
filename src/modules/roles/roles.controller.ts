import { Response } from 'express';

import {
    Controller,
    Get,
    Res,
} from '@nestjs/common';

import { RolesService } from './roles.service';

@Controller('roles')
export class RolesController {
    constructor(
        private readonly rolesService: RolesService,
    ) {}

    @Get()
    async list(@Res() res: Response) {
        const roles = await this.rolesService.findAll();

        return res.json(roles);
    }
}

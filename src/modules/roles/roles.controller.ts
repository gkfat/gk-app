import { Response } from 'express';

import {
    Body,
    Controller,
    Get,
    Post,
    Res,
} from '@nestjs/common';

import { CreateRoleDto } from './dto/create-role.dto';
import { RolesService } from './roles.service';

@Controller('roles')
export class RolesController {
    constructor(
        private readonly rolesService: RolesService
    ) {}

    @Post('create')
    async createRole(@Body() createRoleDto: CreateRoleDto, @Res() res: Response) {
        const role = await this.rolesService.create(createRoleDto);

        return res.json(role);
    }

    @Get()
    async list(@Res() res: Response) {
        const roles = await this.rolesService.findAll();

        return res.json(roles)
    }
}

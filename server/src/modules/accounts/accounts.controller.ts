import { Response } from 'express';
import { RequirePermissions } from 'src/decorators/require-permissions.decorators';
import {
    $TokenPayload,
    ITokenPayload,
} from 'src/decorators/token-payload.decorators';
import { Permissions } from 'src/enums/permissions';
import { AuthGuard } from 'src/middlewares/auth.guard';
import { CacheService } from 'src/middlewares/cache.service';
import { PermissionsGuard } from 'src/middlewares/permissions.guard';
import { AccountsService } from 'src/modules/accounts/accounts.service';

import {
    Body,
    Controller,
    Get,
    HttpStatus,
    NotFoundException,
    Param,
    Post,
    Put,
    Res,
    UnauthorizedException,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { AuthService } from '../auth/auth.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountRolesDto } from './dto/update-account-roles.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Account } from './entities/account.entity';

@ApiBearerAuth('Authorization')
@Controller('accounts')
export class AccountsController {
    constructor(
        private readonly accountsService: AccountsService,
        private readonly authService: AuthService,
        private readonly cacheService: CacheService,
    ) {}

    @Get()
    @UseGuards(AuthGuard, PermissionsGuard)
    @RequirePermissions(Permissions.account.accounts.get)
    async list(@Res() res: Response<Account[]>) {
        const accounts = await this.accountsService.findAll();

        return res.json(accounts);
    }

    @Get('me')
    @UseGuards(AuthGuard, PermissionsGuard)
    @RequirePermissions(Permissions.account.me.get)
    async getAccount(@$TokenPayload() payload: ITokenPayload | null, @Res() res: Response) {
        const { scope: { sub } } = payload;

        const findAccount = await this.accountsService.findOne(+sub);

        if (!findAccount) {
            throw new NotFoundException('Account not found');
        }

        return res.json(findAccount);
    }

    @Post('create')
    @UseGuards(AuthGuard, PermissionsGuard)
    @RequirePermissions(Permissions.account.accounts.add)
    async createAccount(@Body() createAccountDto: CreateAccountDto, @Res() res: Response<Account>) {
        const account =  await this.accountsService.create(createAccountDto);

        return res.json(account);
    }

    @Put(':id/enable')
    @UseGuards(AuthGuard, PermissionsGuard)
    @RequirePermissions(Permissions.account.accounts.update)
    async enableAccount(@Param('id') id: string, @Res() res: Response) {
        const findAccount = await this.accountsService.findOne(+id);

        if (!findAccount) {
            throw new NotFoundException('Account not found');
        }

        await this.accountsService.enableAccount(+id);

        return res.sendStatus(HttpStatus.OK);
    }

    @Put(':id/roles')
    @UseGuards(AuthGuard, PermissionsGuard)
    @RequirePermissions(Permissions.account.accounts.update)
    async updateRoles(@Param('id') id: string, @Body() reqBody: UpdateAccountRolesDto, @Res() res: Response) {
        const findAccount = await this.accountsService.findOne(+id);

        if (!findAccount) {
            throw new NotFoundException('Account not found');
        }

        await this.accountsService.updateAccountRoles(+id, reqBody.roleIds);

        await this.cacheService.deleteValue(`token:${id}`);

        return res.sendStatus(HttpStatus.OK);
    }

    @Put(':id/update')
    @UseGuards(AuthGuard, PermissionsGuard)
    @RequirePermissions(Permissions.account.me.update)
    async update(@$TokenPayload() payload: ITokenPayload, @Param('id') id: string, @Body() reqBody: UpdateAccountDto, @Res() res: Response) {
        const { scope: { sub } } = payload;

        if (+id !== sub) {
            throw new UnauthorizedException('Unauthorized to update others account');
        }

        const account = await this.accountsService.update(+id, reqBody);

        const token = await this.authService.generateJwt(account);

        return res.json({ token });
    }
}

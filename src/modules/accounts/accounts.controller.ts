import { Response } from 'express';
import { AccountsService } from 'src/modules/accounts/accounts.service';

import {
    Body,
    Controller,
    Get,
    NotFoundException,
    Post,
    Res,
} from '@nestjs/common';

import { CreateAccountDto } from './dto/create-account.dto';

@Controller('accounts')
export class AccountsController {
    constructor(
        private readonly accountsService: AccountsService,
    ) {}

    @Post('create')
    async createAccount(@Body() createAccountDto: CreateAccountDto, @Res() res: Response) {
        const account =  await this.accountsService.create(createAccountDto);

        return res.json(account);
    }

    @Get()
    async list(@Res() res: Response) {
        const accounts = await this.accountsService.findAll();

        return res.json(accounts);
    }

    @Get('me')
    async getAccount(@Res() res: Response) {
        const id = 1;
        const findAccount = await this.accountsService.findOne(+id);

        if (!findAccount) {
            throw new NotFoundException('Account not found');
        }

        return res.json(findAccount);

        //     if (!ctx.$tokenPayload) {
        //         ctx.status = StatusCodes.FORBIDDEN;
        //         ctx.body = {
        //             message: 'invalid account',
        //         };
        //         return;
        //     }

        //     const id = Number(ctx.$tokenPayload.scopes.id);
        //     const result = await accountService.getAccountById(id);

    //     ctx.body = result;
    // }
    }
}

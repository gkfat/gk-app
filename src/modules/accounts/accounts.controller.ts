import { Response } from 'express';
import {
    $TokenPayload,
    ITokenPayload,
} from 'src/decorators/token-payload.decorators';
import { AccountsService } from 'src/modules/accounts/accounts.service';

import {
    Body,
    Controller,
    Get,
    NotFoundException,
    Post,
    Res,
    UseGuards,
} from '@nestjs/common';

import { AuthGuard } from '../auth/auth.guard';
import { CreateAccountDto } from './dto/create-account.dto';
import { Account } from './entities/account.entity';

@Controller('accounts')
export class AccountsController {
    constructor(
        private readonly accountsService: AccountsService,
    ) {}

    @Post('create')
    async createAccount(@Body() createAccountDto: CreateAccountDto, @Res() res: Response<Account>) {
        const account =  await this.accountsService.create(createAccountDto);

        return res.json(account);
    }

    @UseGuards(AuthGuard)
    @Get()
    async list(@Res() res: Response) {
        const accounts = await this.accountsService.findAll();

        return res.json(accounts);
    }

    @UseGuards(AuthGuard)
    @Get('me')
    async getAccount(@$TokenPayload() payload: ITokenPayload , @Res() res: Response) {
        const { scope: { sub } } = payload;
        const findAccount = await this.accountsService.findOne(+sub);

        if (!findAccount) {
            throw new NotFoundException('Account not found');
        }

        return res.json(findAccount);
    }
}

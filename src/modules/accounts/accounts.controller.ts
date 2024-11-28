import { AccountsService } from 'src/modules/accounts/accounts.service';

import {
    Controller,
    Get,
} from '@nestjs/common';

@Controller('accounts')
export class AccountsController {
    constructor(
        private readonly accountsService: AccountsService
    ) {}

    @Get()
    async list() {
        return {
            status: 'ok'
        }
        // const res = await this.accountsService.list();

        // return res;
    }

    @Get('/me')
    async getAccount() {
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

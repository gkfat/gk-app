import { Response } from 'express';

import {
    Body,
    Controller,
    ForbiddenException,
    InternalServerErrorException,
    Post,
    Res,
} from '@nestjs/common';

import { AccountsService } from '../accounts/accounts.service';
import { AuthService } from './auth.service';
import { LoginOrCreateDto } from './dto/login-or-create.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly accountsService: AccountsService,
        private readonly authService: AuthService,
    ) {}

    @Post('login')
    async login(@Body() reqBody: LoginOrCreateDto, @Res() res: Response) {
        const { id } = await this.authService.loginOrCreate(reqBody);

        const account = await this.accountsService.findOne(id);

        if (account) {
            if (!account.enabled) {
                throw new ForbiddenException('Account has been freezed');
            }

            const token = await this.authService.generateJwt(account);

            return res.json({
                account,
                token,
            });
        }

        throw new InternalServerErrorException('Login success but something failed');
    }
}

import { Response } from 'express';
import { CacheService } from 'src/middlewares/cache.service';

import {
    BadRequestException,
    Body,
    Controller,
    ForbiddenException,
    HttpStatus,
    InternalServerErrorException,
    Post,
    Res,
} from '@nestjs/common';

import { AccountsService } from '../accounts/accounts.service';
import { AuthService } from './auth.service';
import { LoginOrCreateDto } from './dto/login-or-create.dto';
import { SignUpDto } from './dto/sign-up.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly accountsService: AccountsService,
        private readonly authService: AuthService,
        private readonly cacheService: CacheService,
    ) {}

    @Post('sign-up')
    async signUp(@Body() reqBody: SignUpDto, @Res() res: Response) {
        const findAccount = await this.accountsService.findOneByEmail(reqBody.email);

        if (findAccount) {
            throw new BadRequestException('Invalid email or password');
        }

        const account = await this.accountsService.create(reqBody);

        return res.json({ account });
    }

    @Post('login')
    async login(@Body() reqBody: LoginOrCreateDto, @Res() res: Response) {
        const { id } = await this.authService.loginOrCreate(reqBody);

        const account = await this.accountsService.findOne(id);

        if (account) {
            if (!account.enabled) {
                throw new ForbiddenException('Account has been freezed');
            }

            const token = await this.authService.generateJwt(account);

            return res.status(HttpStatus.OK).json({
                account,
                token,
            });
        }

        throw new InternalServerErrorException('Login success but something failed');
    }
}

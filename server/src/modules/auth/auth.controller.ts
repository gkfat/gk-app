import { Request } from 'express';
import ms from 'ms';
import { OperationLog } from 'src/decorators/operation-log.decorators';
import { ITokenPayload } from 'src/decorators/token-payload.decorators';
import { CacheService } from 'src/middlewares/cache.service';

import {
    BadRequestException,
    Body,
    Controller,
    ForbiddenException,
    InternalServerErrorException,
    Post,
    Req,
} from '@nestjs/common';

import { AccountsService } from '../accounts/accounts.service';
import { AuthService } from './auth.service';
import { LoginOrCreateDto } from './dto/login-or-create.dto';
import {
    SendVerificationCodeDto,
    SignUpDto,
    VerifyCodeDto,
} from './dto/sign-up.dto';
import { EmailService } from './email.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly accountsService: AccountsService,
        private readonly authService: AuthService,
        private readonly emailService: EmailService,
        private readonly cacheService: CacheService,
    ) {}

    private async generateVerificationCode(email: string) {
        const code = this.authService.generateVerificationCode();
        const ttl = ms('10m').toString();
        await this.cacheService.setValue(`verification_code:${email}`, code, ttl);
    
        return code;
    }

    @OperationLog()
    @Post('sign-up')
    async signUp(@Body() reqBody: SignUpDto) {
        const findAccount = await this.accountsService.findOneByEmail(reqBody.email);

        if (findAccount) {
            throw new BadRequestException('Invalid email or password');
        }

        const code = await this.generateVerificationCode(reqBody.email);

        const account = await this.accountsService.create(reqBody);

        await this.emailService.sendVerificationCode(reqBody.email, code);

        return { account };
    }

    @OperationLog()
    @Post('send-verification-code')
    async sendVerificationCode(@Body() reqBody: SendVerificationCodeDto) {
        const verifier = await this.cacheService.getValue(`verification_code:${reqBody.email}`);

        if (verifier) {
            throw new BadRequestException('Reach rate limit, please retry after 10 minutes');
        }
        
        const code = await this.generateVerificationCode(reqBody.email);

        await this.emailService.sendVerificationCode(reqBody.email, code);

        return { message: 'ok' };
    }

    @OperationLog()
    @Post('verify-code')
    async verifyCode(@Body() reqBody: VerifyCodeDto) {
        const {
            email,
            verificationCode,
        } = reqBody;

        const verifier = await this.cacheService.getValue(`verification_code:${email}`);

        if (!verifier) {
            throw new BadRequestException('Verification code expired, please get a new one');
        }

        if (verificationCode !== verifier) {
            throw new BadRequestException('Verification code incorrect');
        }

        await this.authService.verifyAccount(email);

        return { message: 'ok' };
    }

    @OperationLog()
    @Post('login')
    async login(
        @Req() req: Request & { $tokenPayload?: ITokenPayload },
        @Body() reqBody: LoginOrCreateDto,
    ) {
        const { id } = await this.authService.loginOrCreate(reqBody);

        const account = await this.accountsService.findOne(id);

        if (!account) {
            throw new InternalServerErrorException('Login success but something failed');
        }

        if (!account.email_verified) {
            throw new ForbiddenException('Please verified email');
        }

        if (!account.enabled) {
            throw new ForbiddenException('Account has been freezed');
        }

        const token = await this.authService.generateJwt(account);

        const tokenPayload: ITokenPayload = {
            scope: {
                sub: account.id,
                email: account.email,
                name: account.name,
                roles: account.roles,
                permissions: account.permissions,
            },
        };

        req.$tokenPayload = tokenPayload;

        return {
            account,
            token,
        };
    }
}

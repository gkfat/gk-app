import { OperationLog } from 'src/decorators/operation-log.decorators';
import { RequirePermissions } from 'src/decorators/require-permissions.decorators';
import {
    $TokenPayload,
    ITokenPayload,
} from 'src/decorators/token-payload.decorators';
import { Permissions } from 'src/enums';
import { AuthGuard } from 'src/middlewares/auth.guard';
import { PermissionsGuard } from 'src/middlewares/permissions.guard';

import {
    Body,
    Controller,
    Get,
    HttpCode,
    Post,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { RegisterScheduledApisRequestDto } from './dto/register-scheduled-api';
import { PopcronService } from './popcron.service';

@ApiBearerAuth('Authorization')
@Controller('popcron')
export class PopcronController {
    constructor(
        private readonly popcronService: PopcronService,
    ) {}

    @OperationLog()
    @Get('scheduled-apis')
    @UseGuards(AuthGuard, PermissionsGuard)
    @RequirePermissions(Permissions.popcron.scheduledApis.get)
    @HttpCode(200)
    async list(@$TokenPayload() payload: ITokenPayload) {
        const { scope: { sub } } = payload;

        const result = await this.popcronService.listScheduledApiList(+sub);

        return result;
    }

    @OperationLog({ ignoreResponseBody: true })
    @Post('scheduled-apis/register')
    @UseGuards(AuthGuard, PermissionsGuard)
    @RequirePermissions(Permissions.popcron.scheduledApis.add)
    @HttpCode(200)
    async register(@Body() reqBody: RegisterScheduledApisRequestDto) {
        const result = await this.popcronService.registerScheduledApi(reqBody);

        return result;
    }
}

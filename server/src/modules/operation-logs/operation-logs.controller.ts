import { Response } from 'express';
import { RequirePermissions } from 'src/decorators/require-permissions.decorators';
import { Permissions } from 'src/enums';
import { AuthGuard } from 'src/middlewares/auth.guard';
import { PermissionsGuard } from 'src/middlewares/permissions.guard';

import {
    Body,
    Controller,
    Post,
    Res,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { SearchLogsRequestDto } from './dto/search-logs.dto';
import { OperationLogsService } from './operation-logs.service';

@ApiBearerAuth('Authorization')
@Controller('operation-logs')
export class OperationLogsController {
    constructor(
        private readonly operationLogsService: OperationLogsService,
    ) {}

    @Post('search')
    @UseGuards(AuthGuard, PermissionsGuard)
    @RequirePermissions(Permissions.auditing.operationLogs.get)
    async search(@Body() reqBody: SearchLogsRequestDto, @Res() res: Response<any>) {
        const result = await this.operationLogsService.searchLogs(reqBody);

        return res.json(result);
    }

}

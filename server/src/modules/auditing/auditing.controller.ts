import { OperationLog } from 'src/decorators/operation-log.decorators';
import { RequirePermissions } from 'src/decorators/require-permissions.decorators';
import { Permissions } from 'src/enums';
import { AuthGuard } from 'src/middlewares/auth.guard';
import { PermissionsGuard } from 'src/middlewares/permissions.guard';

import {
    Body,
    Controller,
    HttpCode,
    Post,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { AuditingService } from './auditing.service';
import { SearchLogsRequestDto } from './dto/search-logs.dto';

@ApiBearerAuth('Authorization')
@Controller('auditing')
export class AuditingController {
    constructor(
        private readonly auditingService: AuditingService,
    ) {}

    @OperationLog({ ignoreResponseBody: true })
    @Post('operation-log/search')
    @UseGuards(AuthGuard, PermissionsGuard)
    @RequirePermissions(Permissions.auditing.operationLogs.get)
    @HttpCode(200)
    async search(@Body() reqBody: SearchLogsRequestDto) {
        const result = await this.auditingService.searchOperationLog(reqBody);

        return result;
    }

}

import { OperationLog } from 'src/decorators/operation-log.decorators';

import {
    Controller,
    Get,
} from '@nestjs/common';
import {
    HealthCheck,
    HealthCheckService,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
    constructor(
        private readonly healthService: HealthCheckService,
    ) {}

    @OperationLog({ ignoreLog: true })
    @Get()
    @HealthCheck()
    async check() {
        return this.healthService.check([]);
    }
}

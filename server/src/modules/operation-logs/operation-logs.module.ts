import { MiddlewaresModule } from 'src/middlewares/middlewares.module';

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { OperationLogsController } from './operation-logs.controller';
import { OperationLogsService } from './operation-logs.service';

@Module({
    imports: [JwtModule, MiddlewaresModule],
    controllers: [OperationLogsController],
    providers: [OperationLogsService],
    exports: [],
})
export class OperationLogsModule {}

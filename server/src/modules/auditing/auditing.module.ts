import { MiddlewaresModule } from 'src/middlewares/middlewares.module';

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuditingController } from './auditing.controller';
import { AuditingService } from './auditing.service';

@Module({
    imports: [JwtModule, MiddlewaresModule],
    controllers: [AuditingController],
    providers: [AuditingService],
    exports: [AuditingService],
})
export class AuditingModule {}

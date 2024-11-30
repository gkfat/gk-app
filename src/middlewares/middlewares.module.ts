import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthGuard } from './auth.guard';
import { PermissionsGuard } from './permissions.guard';

@Module({
    imports: [JwtModule],
    providers: [AuthGuard, PermissionsGuard],
})
export class MiddlewaresModule {}

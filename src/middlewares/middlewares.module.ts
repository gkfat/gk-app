import { CacheModule } from 'src/modules/cache/cache.module';
import { CacheService } from 'src/modules/cache/cache.service';

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthGuard } from './auth.guard';
import { PermissionsGuard } from './permissions.guard';

@Module({
    imports: [JwtModule, CacheModule],
    providers: [
        AuthGuard,
        PermissionsGuard,
        CacheService,
    ],
})
export class MiddlewaresModule {}

import { CacheService } from 'src/middlewares/cache.service';
import { MiddlewaresModule } from 'src/middlewares/middlewares.module';

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Permission } from './entities/permission.entity';
import { Role } from './entities/role.entity';
import { PrivilegesController } from './privileges.controller';
import { PrivilegesService } from './privileges.service';

@Module({
    imports: [
        JwtModule,
        MiddlewaresModule,
        TypeOrmModule.forFeature([Role, Permission]),
    ],
    controllers: [PrivilegesController],
    providers: [PrivilegesService, CacheService],
    exports: [],
})
export class PrivilegesModule {
}

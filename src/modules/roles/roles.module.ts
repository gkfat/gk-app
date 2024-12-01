import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CacheService } from '../cache/cache.service';
import { Role } from './entities/role.entity';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';

@Module({
    imports: [JwtModule, TypeOrmModule.forFeature([Role])],
    controllers: [RolesController],
    providers: [RolesService, CacheService],
    exports: [],
})
export class RolesModule {
}

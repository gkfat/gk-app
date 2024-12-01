import { MiddlewaresModule } from 'src/middlewares/middlewares.module';

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CacheService } from '../../middlewares/cache.service';
import { Role } from './entities/role.entity';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';

@Module({
    imports: [
        JwtModule,
        MiddlewaresModule,
        TypeOrmModule.forFeature([Role]),
    ],
    controllers: [RolesController],
    providers: [RolesService, CacheService],
    exports: [],
})
export class RolesModule {
}

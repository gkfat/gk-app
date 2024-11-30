import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Role } from './entities/role.entity';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';

@Module({
    imports: [JwtModule, TypeOrmModule.forFeature([Role])],
    controllers: [RolesController],
    providers: [RolesService],
    exports: [],
})
export class RolesModule {
}

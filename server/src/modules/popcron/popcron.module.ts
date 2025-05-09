import { MiddlewaresModule } from 'src/middlewares/middlewares.module';

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { PopcronController } from './popcron.controller';
import { PopcronService } from './popcron.service';
import { TaskService } from './task.service';

@Module({
    imports: [JwtModule, MiddlewaresModule],
    controllers: [PopcronController],
    providers: [PopcronService, TaskService],
    exports: [PopcronService],
})
export class PopcronModule {}

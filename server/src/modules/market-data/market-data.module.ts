import { CacheService } from 'src/middlewares/cache.service';
import { MiddlewaresModule } from 'src/middlewares/middlewares.module';

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { MarketDataController } from './market-data.controller';
import { MarketDataService } from './market-data.service';

@Module({
    imports: [JwtModule, MiddlewaresModule],
    controllers: [MarketDataController],
    providers: [MarketDataService, CacheService],
    exports: [],
})
export class MarketDataModule {
}

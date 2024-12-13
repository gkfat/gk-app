import { CacheService } from 'src/middlewares/cache.service';
import { MiddlewaresModule } from 'src/middlewares/middlewares.module';

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Portfolio } from './enities/portfolio.entity';
import {
    CashTradeRecord,
    FXTradeRecord, StockTradeRecord, 
} from './enities/trade-record.entity';
import { PortfoliosController } from './portfolios.controller';
import { PortfoliosService } from './portfolios.service';

@Module({
    imports: [
        JwtModule,
        MiddlewaresModule, 
        TypeOrmModule.forFeature([
            Portfolio,
            FXTradeRecord,
            StockTradeRecord,
            CashTradeRecord,
        ]),
    ],
    controllers: [PortfoliosController],
    providers: [PortfoliosService, CacheService],
    exports: [],
})
export class PortfoliosModule {
}

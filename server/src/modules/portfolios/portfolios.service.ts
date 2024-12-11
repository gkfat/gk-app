import { EntityManager } from 'typeorm';

import {
    RestClient,
    WebSocketClient,
} from '@fugle/marketdata';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { CreateTradeRecordDto } from './dto/create-trade-record.dto';
import { PortfolioDto } from './dto/portfolio.dto';
import { TickerDto } from './dto/ticker.dto';
import { Portfolio } from './enities/portfolio.entity';
import { TradeRecord } from './enities/trade-record.entity';

function toPortfolioDto(portfolio: Portfolio): PortfolioDto {
    const unrealized_gain_loss = 0;
    const realized_profit_loss = 0;
    const total_cost = 0;
  
    return {
        ...portfolio,
        unrealized_gain_loss,
        realized_profit_loss,
        total_cost,
    };
}

@Injectable()
export class PortfoliosService {
    private restClient = new RestClient({ apiKey: this.configService.get('FUGLE_API_KEY') });
    private webSocketClient = new WebSocketClient({ apiKey: this.configService.get('FUGLE_API_KEY') });

    constructor(
        private readonly configService: ConfigService,
        private readonly entityManager: EntityManager,
    ) { }

    async listPortfoliosByAccountId(accountId: number) {
        const result = await this.entityManager.find(Portfolio, {
            where: { account_id: accountId },
            relations: { tradeRecords: true }, 
        });
        
        return result.map(toPortfolioDto);
    }

    async listTickers() {
        const res = await this.restClient.stock.intraday.tickers({
            type: 'EQUITY',
            exchange: 'TWSE',
            isNormal: true,
        });

        return res;
    }

    async createPortfolio(accountId: number, createPortfolioDto: CreatePortfolioDto) {
        const newPortfolio = new Portfolio({
            account_id: accountId,
            title: createPortfolioDto.title,
            initial_balance: createPortfolioDto.initialBalance,
        });

        const res = await this.entityManager.save(newPortfolio);

        return res;
    }

    async createTradeRecord(createTradeRecordDto: CreateTradeRecordDto) {
        const {
            portfolioId,
            symbol,
            tradeDate,
            direction,
            executionPrice,
            quantity,
            commission,
            tax,
        } = createTradeRecordDto;

        const newTradeRecord = new TradeRecord({
            portfolio_id: portfolioId,
            symbol,
            trade_date: tradeDate,
            direction,
            execution_price: executionPrice,
            quantity,
            total_amount: Math.ceil(executionPrice * quantity),
            commission,
            tax,
        });

        const res = await this.entityManager.save(newTradeRecord);

        return res;
    }

    async quoteTicker(ticker: string) {
        const res = await this.restClient.stock.intraday.quote({ symbol: ticker });

        return new TickerDto({
            date: res.date,
            type: res.type,
            exchange: res.exchange,
            name: res.name,
            openPrice: res.openPrice,
            closePrice: res.closePrice,
            lastPrice: res.lastPrice,
            lastUpdated: res.lastUpdated,
        });
    }
}


import ms from 'ms';
import Numeral from 'numeral';
import {
    EnumMarketType,
    EnumTickerType,
} from 'src/enums/market-data.enum';
import { CacheService } from 'src/middlewares/cache.service';
import { createDate } from 'src/utils/time';
import { EntityManager } from 'typeorm';

import { RestClient } from '@fugle/marketdata';
import { InjectRestClient } from '@fugle/marketdata-nest';
import { RestStockIntradayQuoteResponse } from '@fugle/marketdata/lib/rest/stock/intraday/quote';
import { RestStockIntradayTickersResponse } from '@fugle/marketdata/lib/rest/stock/intraday/tickers';
import {
    Injectable,
    Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';

import { QuoteTicker } from './dto/quote-ticker.dto';
import { GetTickersDto } from './dto/ticker.dto';

const cacheKey = {
    DAILY_TICKERS: 'daily-tickers', QUOTE_TICKER: 'quote-ticker', 
};

@Injectable()
export class MarketDataService {
    private readonly logger = new Logger('marketDataService');

    constructor(
        @InjectRestClient() private readonly client: RestClient,
        private readonly configService: ConfigService,
        private readonly cacheService: CacheService,
        private readonly entityManager: EntityManager,
    ) {}

    /**
     * 每天 8 點取得一次全部 tickers
     */
    @Cron('0 0 8 * * *')
    async fetchTickers(): Promise<RestStockIntradayTickersResponse> {
        const expiresIn = this.configService.get('MARKET_DATA_EXPIRES_IN') || '1d';
        const ttl = ms(expiresIn);
        
        const cacheTickers = await this.cacheService.getValue(cacheKey.DAILY_TICKERS);

        // 無資料，更新資料
        if (!cacheTickers) {
            this.logger.debug('daily tickers: no data, update cache tickers');
            try {
                const res = await this.client.stock.intraday.tickers({
                    type: EnumTickerType.EQUITY,
                    exchange: 'TWSE',
                    market: EnumMarketType.TSE,
                    isNormal: true,
                });

                await this.cacheService.setValue(cacheKey.DAILY_TICKERS, JSON.stringify(res), ttl);
    
                return res;
            } catch (err) {
                this.logger.error('daily tickers: ', err);
            }
        }

        this.logger.debug('daily ticker: use cache tickers');

        const parsedTickers: RestStockIntradayTickersResponse = JSON.parse(cacheTickers);
       
        return parsedTickers;
    }

    /**
     * TODO: 節費
     */
    async fetchQuoteTicker(symbol: string): Promise<RestStockIntradayQuoteResponse> {
        const redisKey = `${cacheKey.QUOTE_TICKER}:${symbol}`;
        const expiresIn = this.configService.get('MARKET_DATA_EXPIRES_IN') || '1d';
        const ttl = ms(expiresIn);
        
        const cacheTicker = await this.cacheService.getValue(redisKey);

        // 無資料，更新資料
        if (!cacheTicker) {
            const res = await this.client.stock.intraday.quote({ symbol });

            await this.cacheService.setValue(redisKey, JSON.stringify({
                ...res,
                lastUpdated: res.lastUpdated / 1000, // 轉型毫秒
            }), ttl);

            return {
                ...res,
                lastUpdated: res.lastUpdated / 1000, // 轉型毫秒
            };
        }

        const parsedTicker: RestStockIntradayQuoteResponse = JSON.parse(cacheTicker);

        // 非同天，更新資料
        if (createDate().isSame(createDate(parsedTicker.date), 'date')) {
            const res = await this.client.stock.intraday.quote({ symbol });

            await this.cacheService.setValue(redisKey, JSON.stringify({
                ...res,
                lastUpdated: res.lastUpdated /1000, // 轉型毫秒
            }), ttl);

            return {
                ...res,
                lastUpdated: res.lastUpdated / 1000, // 轉型毫秒
            };
        }
       
        return parsedTicker;
    }

    async listTickers(): Promise<GetTickersDto> {
        const data = await this.fetchTickers();

        return new GetTickersDto({
            type: data.type as EnumTickerType,
            exchange: data.exchange,
            market: data.market as EnumMarketType,
            date: data.date,
            tickers: data.data,
        });
    }

    async quoteTicker(symbol: string) {
        const data = await this.fetchQuoteTicker(symbol);

        return new QuoteTicker({
            date: data.date,
            type: data.type as EnumTickerType,
            exchange: data.exchange,
            market: data.market as EnumMarketType,
            symbol: data.symbol,
            name: data.name,
            lastPrice: Numeral(data.lastPrice).format('0.00'),
            lastUpdated: data.lastUpdated,
        });
    }
}


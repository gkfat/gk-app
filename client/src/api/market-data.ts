import { MarketData } from '@/types/market-data';

import { request } from './util/agent';

const agent = request('/api/v1/market-data');

export class MarketDataService {
    static async intradayTickers(): Promise<MarketData.Intraday.GetTickers.Response> {
        return agent({
            method: 'GET',
            url: '/intraday/tickers',
        });
    }

    static async intradayQquoteTicker(symbol: string): Promise<MarketData.Intraday.QuoteTicker.Response> {
        return agent({
            method: 'GET',
            url: `/intraday/quote/${symbol}`,
        });
    }

}

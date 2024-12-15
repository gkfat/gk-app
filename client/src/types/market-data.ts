import {
    EnumMarketType,
    EnumTickerType,
} from '@/enums/market-data.enum';

export namespace MarketData {
    export interface Ticker {
        symbol: string;
        name: string;
    }

    export namespace Intraday {
        export namespace GetTickers {
            export interface Response {
                date: string;
                market: EnumMarketType;
                type: EnumTickerType,
                exhange: 'TWSE',
                tickers: Ticker[];
            }
        }

        export namespace QuoteTicker {
            export interface Response {
                date: string;
                market: EnumMarketType;
                type: EnumTickerType;
                exhange: 'TWSE';
                symbol: string;
                name: string;
                lastPrice: string;
                lastUpdated: number;
            }
        }
    }
}
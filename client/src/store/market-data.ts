import {
    computed,
    ref,
} from 'vue';

import { defineStore } from 'pinia';

import { MarketDataService } from '@/api/market-data';
import { MarketData } from '@/types/market-data';

import { createDate } from '../utils/time';

export const useMarketDataStore = defineStore('marketData', () => {
    const tickersInfo = ref<MarketData.Intraday.GetTickers.Response>();
    const tickers = computed(() => {
        if (tickersInfo.value) {
            return tickersInfo.value.tickers.map((tickerInfo) => ({
                title: `${tickerInfo.symbol} ${tickerInfo.name}`,
                value: tickerInfo.symbol,
            }));
        }

        return [];
    });

    const tickersLastPrices = ref<MarketData.Intraday.QuoteTicker.Response[]>([]);

    function toReadableTicker(symbol: string) {
        const findTicker = tickersInfo.value.tickers.find((v) => v.symbol === symbol);

        return findTicker ? `${findTicker.symbol} ${findTicker.name}` : symbol;
    }

    async function refreshTickers() {
        try {
            const data = await MarketDataService.intradayTickers();
            tickersInfo.value = data;
        } catch(err) {
            console.error(err);
        }
    }

    /**
     * 取得 symbol 最新報價
     */
    async function refreshTickerLastPrice(symbol?: string) {
        if (!symbol) {
            return;
        }
        
        try {
            const data = await MarketDataService.intradayQquoteTicker(symbol);

            if (!data.lastUpdated) {
                return;
            }

            const findLastPrice = tickersLastPrices.value.find((v) => v.symbol === symbol);

            if (!findLastPrice) {
                tickersLastPrices.value.push(data);
                return;
            }

            const isSameTime = createDate(findLastPrice.lastUpdated).isSame(createDate(data.lastUpdated));

            if (!isSameTime) {
                findLastPrice.date = data.date;
                findLastPrice.lastUpdated = data.lastUpdated;
                findLastPrice.lastPrice = data.lastPrice;
            }
        } catch(err) {
            console.error(err);
        }
    }

    return {
        tickersInfo, tickers, tickersLastPrices, toReadableTicker, refreshTickers, refreshTickerLastPrice,
    };
});

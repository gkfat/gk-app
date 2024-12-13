import {
  EnumAssetType,
  EnumCashFlow,
  EnumTradeDirection,
} from '@/enums/transaction';

import { Portfolio } from './portfolio';

export namespace Transaction {
    export interface CashTransaction {
        direction: EnumCashFlow;
        quantity: number;
    }

    export interface StockTransaction {
        direction: EnumTradeDirection;
        symbol: string;
        executionPrice: number;
        quantity: number;
    }

    export interface FXTransaction {
        direction: EnumTradeDirection;
        baseCurrency: string;
        targetCurrency: string;
        baseQuantity: number;
        targetQuantity: number;
        exchangeRate: number;
    }

    export namespace Create {
        export interface Request {
            portfolioId: number;
            tradeDate: string;
            assetType: EnumAssetType;
            commission: number;
            tax: number;
            detail: CashTransaction | StockTransaction | FXTransaction;
        }

        export type Response = Portfolio.StockTradeRecord | Portfolio.FXTradeRecord | Portfolio.CashTradeRecord;
    }
}
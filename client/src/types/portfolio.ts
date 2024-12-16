import {
  EnumAssetType,
  EnumCashFlow,
  EnumTradeDirection,
} from '@/enums/transaction';

export namespace Portfolio {
    export interface TradeRecord {
        id: number;
        create_at: string;
        update_at: string;
        portfolio_id: number;
        asset_type: EnumAssetType;
        /** 手續費 */
        commission: number;
        /** 交易日期 */
        trade_date: string;
    }

    export interface CashTradeRecord extends TradeRecord {
        direction: EnumCashFlow;
        /** 交易數量 */
        quantity: number;
    }

    export interface StockTradeRecord extends TradeRecord {
        direction: EnumTradeDirection;
        tax: number;
        /** 股票代號 */
        symbol: string;
        /** 交易價位 */
        execution_price: number;
        /** 交易數量(股) */
        quantity: number;
        /** 成本 */
        cost: number;
        /** 已實現損益 */
        realized_profit_loss: number;
    }
    
    export interface FXTradeRecord extends TradeRecord {
        direction: EnumTradeDirection;
        tax: number;
        /** 本金幣別 */
        base_currency: string;
        /** 交易幣別 */
        target_currency: string;
        /** 匯率 */
        exchange_rate: number;
        /** 本金幣別數量 */
        base_quantity: number;
        /** 目標幣別數量 */
        target_quantity: number;
        /** 成本 */
        cost: number;
        /** 已實現損益 */
        realized_profit_loss: number;
    }

    export interface Position {
        assetType: EnumAssetType;
    }
    
    export interface CashPosition extends Position {
        quantity: number;
        initialBalance: number;
        cashFlow: {
            flows: number[];
            labels: string[];   
        };
        tradeRecords: CashTradeRecord[];
    }

    export interface StockPosition extends Position {
        /** 股票代號 */
        symbol: string;
        /** 持有總數量(股) */
        totalQuantity: number;
        /** 總成本 */
        totalCost: number;
        /** 平均成本 = 總成本 / 總數量 */
        averageCost: number;
        /** 已實現損益 */
        realizedProfitLoss: number;
        /** 報酬率 */
        returnRate: number;
        tradeRecords: StockTradeRecord[];
    }

    export interface FXPosition extends Position {
        currency: string;
        /** 持有總數量 */
        totalQuantity: number;
        /** 總成本 */
        totalCost: number;
        /** 平均成本 = 總成本 / 總數量 */
        averageCost: number;
        /** 已實現損益(本金幣別) */
        realizedProfitLoss: number;
        tradeRecords: FXTradeRecord[];
    }

    export interface Portfolio {
        id: number;
        create_at: string;
        update_at: string;
        title: string;
        create_date: string;
        account_id: number;
        currency: string;
        /** 總成本 */
        costBasis: number;
        /** 已實現損益 */
        realizedProfitLoss: number;
        cashPositions: CashPosition[];
        stockPositions: StockPosition[];
        fxPositions: FXPosition[];
    }

    export namespace Create {
        export interface Request {
            title: string;
            createDate: string;
            currency: string;
            initialBalance: number;
        }

        export type Response = Portfolio;
    }

    export namespace Update {
        export interface Request {
            id: number;
            title?: string;
        }

        export type Response = Portfolio;
    }
}
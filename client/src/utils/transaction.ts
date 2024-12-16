import { EnumTradeDirection } from '@/enums/transaction';

function calcStockSummary(data: {
    direction: EnumTradeDirection;
    executionPrice: number;
    quantity: number;
}) {
    const {
        direction,
        executionPrice,
        quantity,
    } = data;
    
    const subTotal = quantity * executionPrice;
    const refCommission = Math.floor(subTotal * (0.1425 / 100));
    const refTax = direction === EnumTradeDirection.SELL ? Math.floor(subTotal * (0.3 / 100)) : 0;
    const total = subTotal + refCommission + refTax;

    return {
        /** 數量 * 價位 * 0.1425 % */
        refCommission,
        /**
         * 交易稅
         * 賣出: 數量 * 價位 * 0.3 %
         * 買入: 0
         */
        refTax,
        /** 數量 * 價位 */
        subTotal,
        /** (數量 * 價位) + 手續費 + 交易稅 */
        total,
    };
}

export const transactionHelper = { calcStockSummary };
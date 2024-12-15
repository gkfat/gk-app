/** Ticker 類型 */
export enum EnumTickerType {
    /** 股票 */
    EQUITY = 'EQUITY',
    /** 指數 */
    INDEX = 'INDEX',
    /** 權證 */
    WARRANT = 'WARRANT',
    /** 盤中零股 */
    ODDLOT = 'ODDLOT'
};

/** 市場別 */
export enum EnumMarketType {
    /** 上市 */
    TSE = 'TSE',
    /** 上櫃 */
    OTC = 'OTC',
    /** 興櫃 */
    ESB = 'ESB',
}
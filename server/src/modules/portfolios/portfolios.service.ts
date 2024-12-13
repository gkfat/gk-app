import {
  EnumAssetType,
  EnumCashFlow,
  EnumTradeDirection,
} from 'src/enums';
import { EntityManager } from 'typeorm';

import {
  RestClient,
  WebSocketClient,
} from '@fugle/marketdata';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import {
  CashTransactionDto,
  CreateTransactionDto,
  FXTransactionDto,
  StockTransactionDto,
} from './dto/create-transaction.dto';
import {
  CashPositionDto,
  FXPositionDto,
  PortfolioDto,
  StockPositionDto,
} from './dto/portfolio.dto';
import { QuoteTicker } from './dto/quote-ticker.dto';
import {
  GetTickersResponse,
  TickerDto,
} from './dto/ticker.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { Portfolio } from './enities/portfolio.entity';
import {
  CashTradeRecord,
  FXTradeRecord,
  StockTradeRecord,
} from './enities/trade-record.entity';

function toPortfolioDto(portfolio: Portfolio): PortfolioDto {
    const costBasis = 0;
    const realizedProfitLoss = 0;
    const cashPositions: CashPositionDto[] = [];
    const stockPositions: StockPositionDto[] = [];
    const fxPositions: FXPositionDto[] = [];

    portfolio.cashTradeRecords.forEach((record) => {
        if (cashPositions.length === 0) {
            cashPositions.push(new CashPositionDto({
                assetType: EnumAssetType.CASH,
                quantity: record.quantity,
                tradeRecords: [record],
            }));
        } else {
            cashPositions[0].tradeRecords.push(record);
            cashPositions[0].quantity += record.quantity;
        }
    });

    portfolio.stockTradeRecords.forEach((record) => {
        const findPosition = stockPositions.find((p) => p.symbol === record.symbol);

        const {
            symbol,
            direction,
            quantity,
            cost,
            realized_profit_loss,
        } = record;

        if (!findPosition) {
            stockPositions.push(new StockPositionDto({
                assetType: EnumAssetType.STOCK,
                symbol,
                totalQuantity: direction === EnumTradeDirection.BUY ? +quantity : -quantity,
                totalCost: cost,
                averageCost: 0,
                realizedProfitLoss: realized_profit_loss,
                tradeRecords: [record],
            }));
        } else {
            findPosition.tradeRecords.push(record);

            // 買進
            if (direction === EnumTradeDirection.BUY) {
                findPosition.totalQuantity += quantity;
                findPosition.totalCost += cost;
            }
            // 賣出
            else {
                findPosition.totalQuantity -= quantity;
                findPosition.realizedProfitLoss += realizedProfitLoss;
            }
        }
    });

    // 批次計算股票部位平均成本
    stockPositions.forEach((position) => {
        // 平均成本 = (成本加總 / 數量加總)
        position.averageCost = position.totalCost / position.totalQuantity;
    });

    portfolio.fxTradeRecords.forEach((record) => {
        const findPosition = fxPositions.find((p) => p.currency === record.target_currency);

        const {
            direction,
            target_currency,
            target_quantity,
            cost,
            realized_profit_loss,
        } = record;

        if (!findPosition) {
            fxPositions.push(new FXPositionDto({
                assetType: EnumAssetType.FX,
                currency: target_currency,
                totalQuantity: direction === EnumTradeDirection.BUY ? +target_quantity : -target_quantity,
                totalCost: cost,
                averageCost: 0,
                realizedProfitLoss: realized_profit_loss,
                tradeRecords: [record],
            }));
        } else {
            findPosition.tradeRecords.push(record);

            // 買進
            if (direction === EnumTradeDirection.BUY) {
                findPosition.totalQuantity += target_quantity;
                findPosition.totalCost += cost;
            }
            // 賣出
            else {
                findPosition.totalQuantity -= target_quantity;
                findPosition.realizedProfitLoss += realizedProfitLoss;
            }
        }
    });
  
    return new PortfolioDto({
        ...portfolio,
        costBasis,
        realizedProfitLoss,
        cashPositions,
        stockPositions,
        fxPositions,
    });
}

function toTickerDto(data: { symbol: string, name: string }): TickerDto {
    return new TickerDto({
        symbol: data.symbol,
        name: data.name,
    });
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
            relations: {
                cashTradeRecords: true,
                stockTradeRecords: true,
                fxTradeRecords: true,
            },
        });
        
        return result.map(toPortfolioDto);
    }

    async findOne(portfolioId: number) {
        const result = await this.entityManager.findOne(Portfolio, {
            where: { id: portfolioId },
            relations: {
                cashTradeRecords: true,
                stockTradeRecords: true,
                fxTradeRecords: true,
            },
        });

        return toPortfolioDto(result);
    }

    async createPortfolio(accountId: number, createPortfolioDto: CreatePortfolioDto) {
        const result = await this.entityManager.transaction(async (trx) => {
            const newPortfolio = new Portfolio({
                account_id: accountId,
                create_date: createPortfolioDto.createDate,
                title: createPortfolioDto.title,
                currency: createPortfolioDto.currency,
                cashTradeRecords: [
                    new CashTradeRecord({
                        asset_type: EnumAssetType.CASH,
                        trade_date: createPortfolioDto.createDate,
                        direction: EnumCashFlow.DEPOSIT,
                        commission: 0,
                        quantity: createPortfolioDto.initialBalance,
                    }),
                ],
            });
            
            const portfolio =  await trx.save(newPortfolio);

            return await trx.findOne(Portfolio, {
                where: { id: portfolio.id }, relations: {
                    cashTradeRecords: true, stockTradeRecords: true, fxTradeRecords: true, 
                }, 
            });
        });

        return toPortfolioDto(result);
    }

    async updatePortfolio(portfolioId: number, updatePortfolioDto: UpdatePortfolioDto) {
        const findPortfolio = await this.entityManager.findOne(Portfolio, { where: { id: portfolioId } });

        if (updatePortfolioDto.title) {
            findPortfolio.title = updatePortfolioDto.title;
        }

        const result = await this.entityManager.save(findPortfolio);

        return toPortfolioDto(result);
    }

    async deletePortfolio(portfolioId: number) {
        return await this.entityManager.transaction(async (trx) => {
            const portfolio = await trx.findOneBy(Portfolio, { id: portfolioId });

            return await trx.remove(portfolio);
        });
    }

    async createTransaction(createTransactionDto: CreateTransactionDto) {
        const {
            portfolioId,
            assetType,
            tradeDate,
            commission,
            tax,
            detail,
        } = createTransactionDto;

        const baseInfo = {
            portfolio_id: portfolioId,
            trade_date: tradeDate,
            asset_type: assetType,
            commission,
            tax,
        };

        const result = await this.entityManager.transaction(async (trx) => {
            // 現金
            if (assetType === EnumAssetType.CASH) {
                const {
                    direction,
                    quantity, 
                } = detail as CashTransactionDto;

                const newTradeRecord = new CashTradeRecord({
                    ...baseInfo,
                    direction,
                    quantity,
                });

                return await trx.save(newTradeRecord);
            }
            // 外匯
            else if (assetType === EnumAssetType.FX) {
                const {
                    direction,
                    baseCurrency,
                    targetCurrency,
                    exchangeRate,
                    baseQuantity,
                    targetQuantity,
                } = detail as FXTransactionDto;
                
                const newTradeRecord = new FXTradeRecord({
                    ...baseInfo,
                    
                    direction,
                    base_currency: baseCurrency,
                    target_currency: targetCurrency,
                    exchange_rate: exchangeRate,
                    base_quantity: baseQuantity,
                    target_quantity: targetQuantity,
                    cost: direction === EnumTradeDirection.BUY ?  baseQuantity + commission + tax : 0,
                    realized_profit_loss: direction === EnumTradeDirection.BUY ? 0 : baseQuantity - commission - tax,
                });

                return await trx.save(newTradeRecord);
            }
            // 股票
            else if (assetType === EnumAssetType.STOCK) {
                const {
                    direction,
                    symbol,
                    executionPrice,
                    quantity,
                } = detail as StockTransactionDto;

                const amount = executionPrice * quantity;
                
                const newTradeRecord = new StockTradeRecord({
                    ...baseInfo,
    
                    direction,
                    symbol,
                    execution_price: executionPrice,
                    quantity,
                    cost: direction === EnumTradeDirection.BUY ? amount + commission + tax : 0,
                    realized_profit_loss: direction === EnumTradeDirection.BUY ? 0 : amount - commission - tax,
                });

                return await trx.save(newTradeRecord);
            }
        });

        return result;
    }
    
    async listTickers(): Promise<GetTickersResponse> {
        const res = await this.restClient.stock.intraday.tickers({
            type: 'EQUITY',
            exchange: 'TWSE',
            isNormal: true,
        });

        return {
            type: res.type,
            exchange: res.exchange,
            date: res.date,
            tickers: res.data.map(toTickerDto),
        };
    }

    async quoteTicker(ticker: string) {
        const res = await this.restClient.stock.intraday.quote({ symbol: ticker });

        return new QuoteTicker({
            date: res.date,
            type: res.type,
            exchange: res.exchange,
            symbol: res.symbol,
            name: res.name,
            openPrice: res.openPrice,
            closePrice: res.closePrice,
            lastPrice: res.lastPrice,
            lastUpdated: res.lastUpdated,
        });
    }
}


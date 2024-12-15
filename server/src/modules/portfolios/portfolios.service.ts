import {
    EnumAssetType,
    EnumCashFlow,
    EnumTradeDirection,
} from 'src/enums';
import { EntityManager } from 'typeorm';

import { Injectable } from '@nestjs/common';

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
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { Portfolio } from './enities/portfolio.entity';
import {
    CashTradeRecord,
    FXTradeRecord,
    StockTradeRecord,
} from './enities/trade-record.entity';

function calcCashPositions(records: CashTradeRecord[]): CashPositionDto[] {
    const result: CashPositionDto[] = [];
    const initialBalance = records.sort((a, b) => Number(a.create_at) - Number(b.create_at))[0].quantity;

    records.forEach((record) => {
        const mutatedAmount = record.direction ===  EnumCashFlow.DEPOSIT ? +record.quantity : -record.quantity;

        if (result.length === 0) {
            result.push(new CashPositionDto({
                assetType: EnumAssetType.CASH,
                quantity: mutatedAmount,
                initialBalance,
                tradeRecords: [record],
            }));
        } else {
            result[0].tradeRecords.push(record);
            result[0].quantity += mutatedAmount;
        }
    });

    return result;
}

function calcFXPositions(records: FXTradeRecord[]): FXPositionDto[] {
    const result: FXPositionDto[] = [];

    records.forEach((record) => {
        const findPosition = result.find((p) => p.currency === record.target_currency);

        const {
            direction,
            target_currency,
            target_quantity,
            cost,
            realized_profit_loss,
        } = record;

        if (!findPosition) {
            result.push(new FXPositionDto({
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
                findPosition.realizedProfitLoss += realized_profit_loss;
            }
        }
    });

    return result;
}

function calcStockPositions(records: StockTradeRecord[]): StockPositionDto[] {
    const result: StockPositionDto[] = [];
    const holdings = new Set<string>();

    records.forEach((record) => holdings.add(record.symbol));

    // 遍歷所有持有的 symbol, 計算 position info
    Array.from(holdings).forEach((symbol) => {
        const findRecords = records.filter((v) => v.symbol === symbol);
        let totalQuantity = 0;
        let totalCost = 0;
        let realizedProfitLoss = 0;

        findRecords.forEach((record) => {
            const mutatedQuantity = record.direction === EnumTradeDirection.BUY ? +record.quantity : -record.quantity;

            totalCost += record.cost;
            totalQuantity += mutatedQuantity;
            realizedProfitLoss += record.realized_profit_loss;
        });

        // 平均成本 = (成本加總 / 數量加總)
        const averageCost = totalQuantity > 0 ? totalCost / totalQuantity : 0;
        // 報酬率
        const returnRate = realizedProfitLoss / totalCost;

        result.push(new StockPositionDto({
            assetType: EnumAssetType.STOCK,
            symbol,
            totalQuantity,
            totalCost,
            averageCost,
            returnRate,
            realizedProfitLoss,
            tradeRecords: findRecords,
        }));
    });

    return result;
}

function toPortfolioDto(portfolio: Portfolio): PortfolioDto {
    const costBasis = 0;
    const cashPositions = calcCashPositions(portfolio.cashTradeRecords);
    const stockPositions = calcStockPositions(portfolio.stockTradeRecords);
    const fxPositions = calcFXPositions(portfolio.fxTradeRecords);
    /** 總實現損益 */
    const realizedProfitLoss = stockPositions.reduce((value, position) => value + position.realizedProfitLoss, 0);

    return new PortfolioDto({
        ...portfolio,

        costBasis,
        realizedProfitLoss,
        cashPositions,
        stockPositions,
        fxPositions,
    });
}

@Injectable()
export class PortfoliosService {

    constructor(
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

                /** 花費小計 = 成交價 * 股數 */
                const subTotal = executionPrice * quantity;
                /** 花費總計 = (成交價 * 股數) + 手續費 + 稅 */
                const total = subTotal + commission + tax;

                const newCashTradeRecord = new CashTradeRecord({
                    ...baseInfo,

                    asset_type: EnumAssetType.CASH,
                    commission: 0,
                    direction: direction === EnumTradeDirection.BUY ? EnumCashFlow.WITHDRAW : EnumCashFlow.DEPOSIT,
                    quantity: total,
                });

                await trx.save(newCashTradeRecord);

                /**
                 * 計算已累積總成本
                 */
                const { net_cost }: {net_cost: number} = await trx.createQueryBuilder()
                    .select('SUM(cost) - SUM(realized_profit_loss)', 'net_cost')
                    .from(StockTradeRecord, 'stock_trade_record')
                    .where('stock_trade_record.symbol = :symbol', { symbol })
                    .getRawOne();
                
                const newTradeRecord = new StockTradeRecord({
                    ...baseInfo,
    
                    direction,
                    symbol,
                    execution_price: executionPrice,
                    quantity,
                    cost: direction === EnumTradeDirection.BUY ? total : 0,
                    /** (賣出成交價 * 股數 - 手續費 - 稅) - (買入時成本) */
                    realized_profit_loss: direction === EnumTradeDirection.BUY
                        ? 0
                        : (subTotal - commission - tax) - net_cost,
                });

                return await trx.save(newTradeRecord);
            }
        });

        return result;
    }
    
}


<template>
    <v-card 
        rounded="lg"
        elevation="4"
        class="pb-8"
        :min-width="300"
    >
        <v-row class="py-3">
            <v-col cols="auto">
                <v-card-title class="px-5">
                    {{ t(`asset_type.stock`) }}
                </v-card-title>
            </v-col>

            <v-col
                cols="auto"
                class="ml-auto me-3"
            >
                <v-btn
                    class="border me-1"
                    icon="mdi-plus"
                    variant="text"
                    @click="onCreateTransactionClick"
                />
            </v-col>
        </v-row>

        <v-card-text>
            <v-row>
                <v-col
                    v-if="!positions.length"
                    cols="12"
                >
                    無可用資料。
                </v-col>
                <v-col
                    v-for="(position, i) in positions"
                    :key="i"
                    cols="12"
                    md="6"
                >
                    <v-card
                        flat
                        class="border"
                    >
                        <v-row class="align-center">
                            <v-col cols="auto">
                                <v-card-title>
                                    {{ marketDataStore.toReadableTicker(position.symbol) }}
                                </v-card-title>
                            </v-col>
                            
                            <v-spacer />
    
                            <v-col cols="auto">
                                <div class="d-flex align-center ga-1 text-caption text-darkgrey justify-end">
                                    <v-icon
                                        size="16"
                                        icon="mdi-clock-time-eight-outline"
                                    />
                                    <span>{{ timeFormat(symbolLastPriceList[position.symbol].lastUpdated, 'MM/DD HH:mm:ss') }}</span>
                                </div>
                                <span
                                    class="me-2"
                                    :class="`text-${updownClass(
                                        symbolLastPriceList[position.symbol].lastPrice - position.averageCost
                                    )}`"
                                >
                                    {{ thousands(symbolLastPriceList[position.symbol].lastPrice, 2) }}
                                </span>
                                <span :class="`text-${updownClass(symbolLastPriceList[position.symbol].instantReturnRate)}`">
                                    {{ thousands(symbolLastPriceList[position.symbol].instantReturnRate, 2) }} %
                                </span>
                            </v-col>
                                
                            <v-col cols="auto">
                                <v-btn
                                    class="border ma-1"
                                    icon="mdi-delete"
                                    variant="text"
                                    color="error"
                                    @click="onDeleteClick(position)"
                                />
                            </v-col>
                        </v-row>
    
                        <v-card-subtitle>
                            {{ thousands(position.totalQuantity) }} 股
                        </v-card-subtitle>
    
                        <v-card-text>
                            <v-row class="flex-nowrap ga-3">
                                <v-col
                                    cols="4"
                                    class="text-nowrap"
                                >
                                    <p class="text-caption">
                                        市值
                                    </p>
                                    {{ thousands(symbolLastPriceList[position.symbol].marketValue) }}
                                </v-col>
                                <v-col
                                    cols="4"
                                    class="text-nowrap"
                                >
                                    <p class="text-caption">
                                        成本
                                    </p>
                                    {{ thousands(position.totalCost, 2) }}
                                </v-col>
                                <v-col
                                    cols="4"
                                    class="text-nowrap"
                                >
                                    <p class="text-caption">
                                        平均成本
                                    </p>
                                    {{ thousands(position.averageCost, 2) }}
                                </v-col>
                            </v-row>
                            <v-row class="flex-nowrap ga-3">
                                <v-col
                                    cols="4"
                                    class="text-nowrap"
                                >
                                    <p class="text-caption">
                                        未實現損益
                                    </p>
                                    <p :class="`text-${updownClass(symbolLastPriceList[position.symbol].unrealizedPorfitLoss)}`">
                                        {{ thousands(symbolLastPriceList[position.symbol].unrealizedPorfitLoss) }}
                                    </p>
                                </v-col>
                                <v-col
                                    cols="4"
                                    class="text-nowrap"
                                >
                                    <p class="text-caption">
                                        已實現損益
                                    </p>
                                    <p :class="`text-${updownClass(position.realizedProfitLoss)}`">
                                        {{ thousands(position.realizedProfitLoss) }}
                                    </p>
                                </v-col>
                                <v-col
                                    cols="4"
                                    class="text-nowrap"
                                >
                                    <p class="text-caption">
                                        報酬率
                                    </p>
                                    <p :class="`text-${updownClass(position.realizedProfitLoss)}`">
                                        {{ thousands(position.returnRate * 100, 2) }} %
                                    </p>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>

    <StockCreateTransaction
        ref="createTransactionRef"
        @update:transaction="onTransactionUpdate"
    />

    <DeletePosition
        ref="deletePositionRef"
        @update:delete="emit('update:position')"
    />
</template>
<script lang="ts" setup>
import {
    computed,
    onBeforeUnmount,
    onMounted,
    ref,
} from 'vue';

import { useI18n } from 'vue-i18n';

import {
    EnumAssetType,
    EnumTradeDirection,
} from '@/enums/transaction';
import { useMarketDataStore } from '@/store/market-data';
import { Portfolio } from '@/types/portfolio';
import { updownClass } from '@/utils/common';
import { thousands } from '@/utils/number';
import { timeFormat } from '@/utils/time';
import { transactionHelper } from '@/utils/transaction';
import { templateRef } from '@vueuse/core';

import DeletePosition from './components/DeletePosition.vue';
import StockCreateTransaction from './components/StockCreateTransaction.vue';

const { t } = useI18n();
const marketDataStore = useMarketDataStore();
const createTransactiorRef = templateRef('createTransactionRef');
const deletePositionRef = templateRef('deletePositionRef');

const {
    portfolio,
    positions,
} = defineProps<{
    portfolio: Portfolio.Portfolio;
    positions: Portfolio.StockPosition[]
}>();

const emit = defineEmits(['update:position']);

const onCreateTransactionClick = () => {
    createTransactiorRef.value?.show({
        portfolio,
        assetType: EnumAssetType.STOCK,
    });
};

const intervalId = ref<ReturnType<typeof setInterval>>();

const symbolLastPriceList = computed(() => {
    const result: { [key: string]: {
        lastPrice: number;
        lastUpdated: number;
        marketValue: number;
        unrealizedPorfitLoss: number;
        instantReturnRate: number;
    } } = {};

    positions.forEach((p) => {
        const findInfo =  marketDataStore.tickersLastPrices.find((v) => v.symbol === p.symbol);

        result[p.symbol] = {
            lastPrice:  NaN,
            lastUpdated:  NaN,
            marketValue:  NaN,
            unrealizedPorfitLoss: NaN,
            instantReturnRate: NaN,
        };
        
        if (findInfo) {
            const {
                refTax,
                refCommission,
                subTotal: marketValue,
            } = transactionHelper.calcStockSummary({
                direction: EnumTradeDirection.SELL,
                executionPrice: Number(findInfo.lastPrice),
                quantity: p.totalQuantity,
            });
            
            /** 未實現損益: (市值 – 賣出手續費 – 賣出證交稅) – (成本) */
            const unrealizedPorfitLoss = marketValue - p.totalCost - refCommission - refTax;
            /** 未實現損益 / 總成本 */
            const instantReturnRate = (unrealizedPorfitLoss / p.totalCost) * 100;
        
            result[p.symbol] = {
                lastPrice: Number(findInfo.lastPrice),
                lastUpdated: findInfo.lastUpdated,
                unrealizedPorfitLoss,
                marketValue,
                instantReturnRate,
            };
        }
    });

    return result;
});

const refreshAllTickers = async () => {
    await Promise.all(
        positions.map((v) => marketDataStore.refreshTickerLastPrice(v.symbol)),
    );
};

const startListener = () => {
    refreshAllTickers();

    intervalId.value = setInterval(async () => {
        await refreshAllTickers();
    }, 5000);
};

const stopListener = () => {
    if (intervalId.value) {
        clearInterval(intervalId.value);
    }
};

const onTransactionUpdate = () => {
    stopListener();
    startListener();
    emit('update:position');
};

const onDeleteClick = (position: Portfolio.StockPosition) => {
    deletePositionRef.value?.show({
        portfolioId: portfolio.id,
        symbol: position.symbol,
    });
};

onMounted(() => {
    startListener();
});

onBeforeUnmount(() => {
    stopListener();
});
</script>
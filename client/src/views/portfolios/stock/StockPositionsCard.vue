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
                    class="border"
                    icon="mdi-plus"
                    variant="text"
                    @click="onCreateTransactionClick"
                />
            </v-col>
        </v-row>

        <v-row class="mx-3 ga-3">
            <v-col
                v-for="(position, i) in positions"
                :key="i"
                cols="12"
                class="pa-0"
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
                        <v-col
                            cols="auto"
                            class="ml-auto me-3"
                        >
                            <span>{現價} </span>
                            <span>{即時報酬率%}</span>
                        </v-col>
                    </v-row>

                    <v-card-subtitle>
                        {{ thousands(position.totalQuantity) }} 股
                    </v-card-subtitle>

                    <v-card-text>
                        <v-row class="flex-nowrap ga-3">
                            <v-col
                                cols="auto"
                                class="text-nowrap"
                            >
                                <p class="text-caption">
                                    市值
                                </p>
                                {{ 'N/A' }}
                            </v-col>
                            <v-col
                                cols="auto"
                                class="text-nowrap"
                            >
                                <p class="text-caption">
                                    成本
                                </p>
                                {{ thousands(position.totalCost) }}
                            </v-col>
                            <v-col
                                cols="auto"
                                class="text-nowrap"
                            >
                                <p class="text-caption">
                                    平均成本
                                </p>
                                {{ thousands(position.averageCost) }}
                            </v-col>
                            <v-col
                                cols="auto"
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
                                cols="auto"
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
    </v-card>

    <StockCreateTransaction
        ref="createTransactionRef"
        @update:transaction="emit('update:transaction')"
    />
</template>
<script lang="ts" setup>
import { onMounted } from 'vue';

import { useI18n } from 'vue-i18n';

import { EnumAssetType } from '@/enums/transaction';
import { useMarketDataStore } from '@/store/market-data';
import { Common } from '@/types/common';
import { Portfolio } from '@/types/portfolio';
import { updownClass } from '@/utils/common';
import { thousands } from '@/utils/number';
import { templateRef } from '@vueuse/core';

import StockCreateTransaction from './StockCreateTransaction.vue';

const { t } = useI18n();
const marketDataStore = useMarketDataStore();
const createTransactiorRef = templateRef('createTransactionRef');

const {
    portfolio,
    positions,
} = defineProps<{
    portfolio: Portfolio.Portfolio;
    positions: Portfolio.StockPosition[]
}>();

const emit = defineEmits(['update:transaction']);

/** 即時報酬率 */
const calcInstantReturnRate = (item: Portfolio.StockPosition) => {
    // (市值 - 總成本) / 總成本
    // return ((marketValue.value - item.totalCost) / item.totalCost) * 100;
    return 'N/A';
};

const onCreateTransactionClick = () => {
    createTransactiorRef.value?.show({
        portfolio,
        assetType: EnumAssetType.STOCK,
    });
};

onMounted(() => {
    
});
</script>
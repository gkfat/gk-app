<template>
    <v-card class="pa-3">
        <v-row class="justify-space-between">
            <v-col cols="auto">
                <v-card-subtitle>
                    {{ t(`asset_type.stock`) }}
                </v-card-subtitle>
            </v-col>
            <v-col
                cols="auto"
                class="align-center d-flex ga-3 me-3"
            >
                <v-btn
                    variant="outlined"
                    color="primary"
                    text="新增交易"
                    @click="onCreateTransactionClick"
                />
            </v-col>
        </v-row>

        <v-card-text>
            <v-data-table
                :headers="tableHeaders"
                :items="positions"
                hide-default-footer
            />
        </v-card-text>
    </v-card>

    <CreateTransaction
        ref="createTransactionRef"
    />
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

import { EnumAssetType } from '@/enums/transaction';
import { Common } from '@/types/common';
import { Portfolio } from '@/types/portfolio';
import { thousands } from '@/utils/number';
import { templateRef } from '@vueuse/core';

import CreateTransaction from './CreateTransaction.vue';

const { t } = useI18n();
const createTransactiorRef = templateRef('createTransactionRef');

const {
    portfolioId, positions, 
} = defineProps<{
    portfolioId: number;
    positions: Portfolio.StockPosition[]
}>();

const tableHeaders: Common.DataTableHeader<Portfolio.StockPosition>[] = [
    {
        key: 'symbol',
        title: '標的',
        align: 'center',
    },
    {
        key: 'currentValue',
        title: '現價',
        align: 'center',
        value: () => 'N/A',
    },
    {
        key: 'marketValue',
        title: '市值',
        align: 'center',
        value: () => 'N/A',
    },
    {
        key: 'totalQuantity',
        title: '持有數量(股)',
        align: 'center',
        value: (item) => thousands(item.totalQuantity),
    },
    {
        key: 'totalCost',
        title: '總成本',
        align: 'center',
        value: (item) => thousands(item.totalCost),
    },
    {
        key: 'realizedProfitLoss',
        title: '已實現損益',
        align: 'center',
        value: (item) => thousands(item.realizedProfitLoss),
    },
    {
        key: 'averageCost',
        title: '平均成本(股)',
        align: 'center',
        value: (item) => thousands(item.averageCost),
    },
    {
        key: 'instantReturnRate',
        title: '即時報酬率',
        align: 'center',
        value: (item) => `${calcInstantReturnRate(item)} %`,
    },
];

/** 即時報酬率 */
const calcInstantReturnRate = (item: Portfolio.StockPosition) => {
    // (市值 - 總成本) / 總成本
    // return ((marketValue.value - item.totalCost) / item.totalCost) * 100;
    return 'N/A';
};

const onCreateTransactionClick = () => {
    createTransactiorRef.value?.show({
        portfolioId,
        assetType: EnumAssetType.STOCK,
    });
};
</script>
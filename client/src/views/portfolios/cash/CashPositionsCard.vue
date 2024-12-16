<template>
    <v-card
        rounded="lg"
        elevation="4"
        :min-width="300"
        class="fill-height"
    >
        <v-row class="py-3">
            <v-col cols="auto">
                <v-card-title class="px-5">
                    {{ t(`asset_type.cash`) }}
                </v-card-title>
            </v-col>

            <v-col
                cols="auto"
                class="ml-auto me-3"
            >
                <v-btn
                    icon="mdi-swap-horizontal"
                    class="border"
                    variant="text"
                    @click="onCreateTransactionClick"
                />
            </v-col>
        </v-row>

        <v-row class="mx-3 ga-3">
            <v-col
                v-if="!positions.length"
                cols="12"
            >
                無可用資料。
            </v-col>
            <!-- <v-col cols="12">
                <v-sparkline
                    :model-value="positions[0].cashFlow.flows"
                    auto-draw
                    auto-draw-duration="500"
                    show-labels
                    :labels="positions[0].cashFlow.labels"
                    line-width="1"
                />
            </v-col> -->
            <v-col
                cols="12"
                class="px-0"
            >
                <LineChart :chart-data="chartData" />
            </v-col>
        </v-row>
    </v-card>

    <CashCreateTransaction
        ref="createTransactionRef"
        @update:transaction="emit('update:transaction')"
    />
</template>
<script lang="ts" setup>
import { computed } from 'vue';

import { useI18n } from 'vue-i18n';

import LineChart from '@/components/charts/LineChart.vue';
import { EnumAssetType } from '@/enums/transaction';
import { Portfolio } from '@/types/portfolio';
import { templateRef } from '@vueuse/core';

import CashCreateTransaction from './CashCreateTransaction.vue';

const { t } = useI18n();

const {
    portfolio,
    positions, 
} = defineProps<{
    portfolio: Portfolio.Portfolio;
    positions: Portfolio.CashPosition[]
}>();

const emit = defineEmits(['update:transaction']);
const createTransactiorRef = templateRef('createTransactionRef');

const chartData = computed(() => {
    return {
        labels: positions[0].cashFlow.labels,
        datasets: [
            {
                label: 'Cash flow',
                data: positions[0].cashFlow.flows,
            },
        ],
    };
});

const onCreateTransactionClick = () => {
    createTransactiorRef.value?.show({
        portfolio,
        assetType: EnumAssetType.CASH,
    });
};
</script>
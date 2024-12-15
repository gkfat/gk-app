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
    </v-card>

    <CashCreateTransaction
        ref="createTransactionRef"
        @update:transaction="emit('update:transaction')"
    />
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

import { EnumAssetType } from '@/enums/transaction';
import { Portfolio } from '@/types/portfolio';
import { thousands } from '@/utils/number';
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

const onCreateTransactionClick = () => {
    createTransactiorRef.value?.show({
        portfolio,
        assetType: EnumAssetType.CASH,
    });
};
</script>
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
                    {{ portfolio.title }} <span class="text-caption">{{ portfolio.currency }}</span>
                </v-card-title>
    
                <v-card-subtitle class="mb-3">
                    初始資金 $ {{ thousands(positions[0].initialBalance) }}
                </v-card-subtitle>
            </v-col>

            <v-col
                cols="auto"
                class="ml-auto me-3"
            >
                <v-btn
                    class="border"
                    icon="mdi-pencil"
                    variant="text"
                    @click="onEditClick"
                />
            </v-col>
        </v-row>

        <v-card-text class="bg-grey">
            <v-row class="align-center">
                <v-col cols="auto">
                    <p>資金</p>
                    <p class="text-h6">
                        $ {{ thousands(positions[0].quantity) }}
                    </p>
                </v-col>
                <v-col cols="auto">
                    <p>損益</p>
                    <p
                        class="text-h6"
                        :class="`text-${updownClass(portfolio.realizedProfitLoss)}`"
                    >
                        $ {{ thousands(portfolio.realizedProfitLoss) }}
                    </p>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

import { EnumAssetType } from '@/enums/transaction';
import { Portfolio } from '@/types/portfolio';
import { updownClass } from '@/utils/common';
import { thousands } from '@/utils/number';
import { templateRef } from '@vueuse/core';

const { t } = useI18n();

const {
    portfolio,
    positions, 
} = defineProps<{
    portfolio: Portfolio.Portfolio;
    positions: Portfolio.CashPosition[]
}>();

const emit = defineEmits(['update:transaction']);

const onEditClick = () => {
    createTransactiorRef.value?.show({
        portfolio,
        assetType: EnumAssetType.CASH,
    });
};
</script>
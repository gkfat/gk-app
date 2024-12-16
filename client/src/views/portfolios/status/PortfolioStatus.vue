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
                    <span>初始資金 $ {{ thousands(positions[0].initialBalance) }}</span><br>
                    <span>起始於 {{ portfolio.create_date }}</span>
                </v-card-subtitle>
            </v-col>

            <v-col
                cols="auto"
                class="ml-auto me-3"
            >
                <v-btn
                    class="border me-3"
                    icon="mdi-pencil"
                    variant="text"
                    @click="onEditClick"
                />
                <v-btn
                    class="border"
                    icon="mdi-delete"
                    variant="text"
                    color="error"
                    @click="onDeleteClick"
                />
            </v-col>
        </v-row>

        <v-card-text class="bg-grey">
            <v-row class="align-center">
                <v-col cols="auto">
                    <p>資金</p>
                    <p
                        class="text-h6"
                        :class="`text-${updownClass(positions[0].quantity)}`"
                    >
                        $ {{ thousands(positions[0].quantity, 2) }}
                    </p>
                </v-col>
                <v-col cols="auto">
                    <p>損益</p>
                    <p
                        class="text-h6"
                        :class="`text-${updownClass(portfolio.realizedProfitLoss)}`"
                    >
                        $ {{ thousands(portfolio.realizedProfitLoss, 2) }}
                    </p>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>

    <DeletePortfolio
        ref="deletePortfolioRef"
        @update:delete="emit('update:portfolio')"
    />
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

import { EnumAssetType } from '@/enums/transaction';
import { Portfolio } from '@/types/portfolio';
import { updownClass } from '@/utils/common';
import { thousands } from '@/utils/number';
import { templateRef } from '@vueuse/core';

import DeletePortfolio from './components/DeletePortfolio.vue';

const { t } = useI18n();
const deletePortfolioRef = templateRef('deletePortfolioRef');

const {
    portfolio,
    positions, 
} = defineProps<{
    portfolio: Portfolio.Portfolio;
    positions: Portfolio.CashPosition[]
}>();

const emit = defineEmits(['update:portfolio']);

const onEditClick = () => {
    // createTransactiorRef.value?.show({
    //     portfolio,
    //     assetType: EnumAssetType.CASH,
    // });
};

const onDeleteClick = () => {
    deletePortfolioRef.value?.show(portfolio);
};
</script>
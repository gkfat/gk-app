<template>
    <PageContent
        :loading="inProgress"
        show-go-to-top
    >
        <v-card elevation="2">
            <v-card-title>
                {{ '投資組合' }}
            </v-card-title>
            <v-card-text>
                <v-row class="align-center">
                    <v-col
                        cols="auto"
                        class="ml-auto"
                    >
                        <v-btn
                            v-if="havePermissionTo.add"
                            color="success"
                            class="mr-3"
                            append-icon="mdi-plus"
                            @click="onCreatePortfolioClick"
                        >
                            {{ t('button.create') }}
                        </v-btn>
                        <v-btn
                            color="primary"
                            append-icon="mdi-reload"
                            @click="listPortfolios"
                        >
                            {{ t('button.refresh') }}
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>

        <v-spacer class="mb-3" />

        <v-item-group
            v-model="currentPortfolio"
            mandatory
        >
            <v-row class="px-3">
                <v-col
                    v-for="(item, i) in portfolios"
                    :key="i"
                    cols="auto"
                >
                    <v-item
                        v-slot="{isSelected, toggle}"
                        :value="item"
                    >
                        <v-card
                            :color="isSelected ? 'primary': ''"
                            rounded="lg"
                            :max-width="200"
                            :title="item.title"
                            @click="toggle"
                        />
                    </v-item>
                </v-col>
            </v-row>
        </v-item-group>

        <v-spacer class="my-5" />

        <v-row
            v-if="currentPortfolio"
            class="px-3 mb-5 align-items-stretch"
        >
            <v-col
                cols="12"
                md="6"
            >
                <PortfolioStatus
                    :portfolio="currentPortfolio"
                    :positions="currentPortfolio.cashPositions"
                    @update:portfolio="listPortfolios"
                />
            </v-col>
            
            <v-col
                cols="12"
                md="6"
            >
                <CashPositionsCard
                    :portfolio="currentPortfolio"
                    :positions="currentPortfolio.cashPositions"
                    @update:transaction="listPortfolios"
                />
            </v-col>

            <v-col cols="12">
                <StockPositionsCard
                    :portfolio="currentPortfolio"
                    :positions="currentPortfolio.stockPositions"
                    @update:position="listPortfolios"
                />
            </v-col>
        </v-row>
    </PageContent>

    <CreatePortfolio
        ref="createPortfolioRef"
        @submit="listPortfolios"
    />
</template>

<script lang="ts" setup>
import {
    onMounted,
    ref,
} from 'vue';

import { useI18n } from 'vue-i18n';

import { PortfoliosService } from '@/api/portfolios';
import { Permissions } from '@/enums/permissions';
import PageContent from '@/layouts/panel/PageContent.vue';
import { useAuthStore } from '@/store/auth';
import { useMarketDataStore } from '@/store/market-data';
import { useNotifierStore } from '@/store/notifier';
import { Portfolio } from '@/types/portfolio';
import { templateRef } from '@vueuse/core';

import CashPositionsCard from './cash/CashPositionsCard.vue';
import CreatePortfolio from './components/CreatePortfolio.vue';
import PortfolioStatus from './status/PortfolioStatus.vue';
import StockPositionsCard from './stock/StockPositionsCard.vue';

const notifierStore = useNotifierStore();
const marketDataStore = useMarketDataStore();
const authStore = useAuthStore();
const { t } = useI18n();

const createPortfolioRef = templateRef('createPortfolioRef');

/**
 * 操作權限
 */
const havePermissionTo = ref({
    add: authStore.havePermission(Permissions.portfolio.portfolios.add),
    update: authStore.havePermission(Permissions.portfolio.portfolios.update),
    delete: authStore.havePermission(Permissions.portfolio.portfolios.delete),
});

const inProgress = ref(false);
const portfolios = ref<Portfolio.Portfolio[]>([]);

const currentPortfolio = ref<Portfolio.Portfolio>();

const listPortfolios = async () => {
    inProgress.value = true;
    try {
        portfolios.value = await PortfoliosService.list();
        currentPortfolio.value = portfolios.value[0];
    } catch {
        notifierStore.error({ content: '取得投資組合失敗' });
    }
    inProgress.value = false;
};

const onCreatePortfolioClick = () => {
    createPortfolioRef.value?.show();
};

onMounted(async () => {
    marketDataStore.refreshTickers();
    await listPortfolios();
});
</script>

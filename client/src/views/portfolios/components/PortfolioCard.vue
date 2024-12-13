<template>
    <v-card
        v-if="portfolio"
        flat
    >
        <v-card-title>
            <v-row class="align-center">
                <v-col
                    cols="auto"
                    class="text-h5 font-weight-bold"
                >
                    {{ portfolio.title }}
                </v-col>

                <v-col
                    cols="auto"
                    class="ml-auto"
                >
                    {{ portfolio.currency }}
                </v-col>
            </v-row>
        </v-card-title>

        <v-card-subtitle>
            起始於 {{ portfolio.create_date }}
        </v-card-subtitle>

        <v-card-text>
            <v-row>
                <v-col cols="12">
                    <CashPositionsCard
                        :currency="portfolio.currency"
                        :positions="portfolio.cashPositions"
                    />
                </v-col>

                <v-col cols="12">
                    <StockPositionsCard
                        :portfolio-id="portfolio.id"
                        :positions="portfolio.stockPositions"
                    />
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>
<script lang="ts" setup>
import { Portfolio } from '@/types/portfolio';

import CashPositionsCard from './CashPositionsCard.vue';
import StockPositionsCard from './StockPositionsCard.vue';

const { portfolio } = defineProps<{
    portfolio: Portfolio.Portfolio
}>();
</script>
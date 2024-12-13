<template>
    <v-card class="pa-3">
        <v-row class="justify-space-between">
            <v-col cols="auto">
                <v-card-subtitle>
                    {{ t(`asset_type.cash`) }} {{ currency }}
                </v-card-subtitle>
            </v-col>
            <v-col
                cols="auto"
                class="align-center d-flex ga-3 me-3"
            >
                <v-btn
                    variant="outlined"
                    color="primary"
                    text="存入"
                />
                <v-btn
                    variant="outlined"
                    color="primary"
                    text="領回"
                />
            </v-col>
        </v-row>

        <v-card-text>
            <v-row>
                <v-col
                    cols="auto"
                    class="text-h6"
                >
                    $ {{ thousands(positions[0].quantity) }}
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

import { Portfolio } from '@/types/portfolio';
import { thousands } from '@/utils/number';

const { t } = useI18n();

const {
    currency, positions, 
} = defineProps<{
    currency: string;
    positions: Portfolio.CashPosition[]
}>();
</script>
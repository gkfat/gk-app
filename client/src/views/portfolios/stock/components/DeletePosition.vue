<template>
    <v-dialog
        v-model="openDialog"
        persistent
        :width="300"
    >
        <v-card
            rounded="lg"
            :loading="inProgress"
            :disabled="inProgress"
        >
            <v-card-title class="text-error">
                確認刪除資產？
            </v-card-title>

            <v-card-text>
                {{ marketDataStore.toReadableTicker(symbol) }}
            </v-card-text>

            <v-divider />

            <v-card-actions>
                <v-spacer />
                <v-btn
                    color="success"
                    @click="onSubmit"
                >
                    {{ t('button.confirm') }}
                </v-btn>
                <v-btn
                    color="cancel"
                    @click="toggleDialog(false)"
                >
                    {{ t('button.cancel') }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import { useI18n } from 'vue-i18n';

import { PortfoliosService } from '@/api/portfolios';
import { EnumAssetType } from '@/enums/transaction';
import { useMarketDataStore } from '@/store/market-data';
import { useNotifierStore } from '@/store/notifier';
import { Portfolio } from '@/types/portfolio';

const { t } = useI18n();
const notifierStore = useNotifierStore();
const marketDataStore = useMarketDataStore();
const inProgress = ref(false);
const openDialog = ref(false);

const portfolioId = ref<number>();
const symbol = ref<string>();

const toggleDialog = (open: boolean) => {
    openDialog.value = open;
};

const show = (data: {
    portfolioId: number;
    symbol: string;
}) => {
    portfolioId.value = data.portfolioId;
    symbol.value = data.symbol;
    toggleDialog(true);
};

defineExpose({ show });

const emit = defineEmits(['update:delete']);

const onSubmit = async () => {
    inProgress.value = true;

    try {
        const params: Portfolio.DeletePosition.Request = {
            id: portfolioId.value,
            assetType: EnumAssetType.STOCK,
            symbol: symbol.value,
        };

        await PortfoliosService.deleteStockPosition(params);
        notifierStore.success({ content: '刪除資產成功' });
        emit('update:delete');
    } catch (err) {
        console.error(err);
        notifierStore.error({ content: '刪除資產失敗' });
    }

    inProgress.value = false;
    toggleDialog(false);
};

</script>

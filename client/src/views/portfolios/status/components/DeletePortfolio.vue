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
            <v-toolbar color="error">
                <v-card-title>
                    刪除投資組合
                </v-card-title>
                <v-btn
                    class="ml-auto"
                    icon="mdi-close"
                    :disabled="isSelecting"
                    @click="toggleDialog(false)"
                />
            </v-toolbar>

            <v-card-text>
                <p class="mb-3">
                    確認刪除 <span class="text-info font-weight-bold">{{ portfolio.title }}</span> ？
                </p>
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
import { useNotifierStore } from '@/store/notifier';
import { Portfolio } from '@/types/portfolio';

const { t } = useI18n();
const notifierStore = useNotifierStore();

const portfolio = ref<Portfolio.Portfolio>();
const inProgress = ref(false);
const openDialog = ref(false);

const toggleDialog = (open: boolean) => {
    openDialog.value = open;
};

const show = (data: Portfolio.Portfolio) => {
    portfolio.value = data;
    toggleDialog(true);
};

defineExpose({ show });

const emit = defineEmits(['update:delete']);

const onSubmit = async () => {
    inProgress.value = true;

    try {
        await PortfoliosService.delete(portfolio.value.id);
        emit('update:delete');
    } catch (err) {
        console.error(err);
        notifierStore.error({ content: '刪除投資組合失敗' });
    }
    inProgress.value = false;
    toggleDialog(false);
};

</script>

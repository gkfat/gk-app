<template>
    <v-card
        :loading="inProgress"
        :disabled="inProgress"
        rounded="lg"
        elevation="4"
        :min-width="300"
        class="fill-height"
    >
        <v-row class="py-3">
            <v-col cols="auto">
                <v-card-title
                    v-if="!isEditing"
                    class="px-5"
                >
                    {{ portfolio.title }}
                </v-card-title>
                <v-card-title v-else>
                    <v-text-field
                        v-model="form.title.value.value"
                        variant="underlined"
                        density="compact"
                        hide-details="auto"
                        :error-messages="form.title.errorMessage.value"
                    />
                </v-card-title>
    
                <v-card-subtitle class="mb-3">
                    <span>{{ portfolio.currency }}</span>
                    <span>初始資金 $ {{ thousands(positions[0].initialBalance) }}</span><br>
                    <span>起始於 {{ portfolio.create_date }}</span>
                </v-card-subtitle>
            </v-col>

            <v-col
                cols="auto"
                class="ml-auto me-3"
            >
                <template v-if="!isEditing">
                    <v-btn
                        class="border me-1"
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
                </template>
                <template v-else>
                    <v-btn
                        class="border me-1"
                        icon="mdi-check"
                        variant="text"
                        color="primary"
                        @click="onConfirmEdit"
                    />
                    <v-btn
                        class="border"
                        icon="mdi-close"
                        variant="text"
                        @click="onCancelEdit"
                    />
                </template>
            </v-col>
        </v-row>

        <v-card-text>
            <v-row class="align-center">
                <v-col cols="auto">
                    <p>總支出</p>
                    <p class="text-h6">
                        $ {{ thousands(totalCost, 2) }}
                    </p>
                </v-col>
                <v-col cols="auto">
                    <p>剩餘現金</p>
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
import {
    computed,
    ref,
} from 'vue';

import {
    useField,
    useForm,
} from 'vee-validate';
import { useI18n } from 'vue-i18n';
import * as yup from 'yup';

import { PortfoliosService } from '@/api/portfolios';
import { useNotifierStore } from '@/store/notifier';
import { Portfolio } from '@/types/portfolio';
import { updownClass } from '@/utils/common';
import { thousands } from '@/utils/number';
import { templateRef } from '@vueuse/core';

import DeletePortfolio from './components/DeletePortfolio.vue';

const { t } = useI18n();
const deletePortfolioRef = templateRef('deletePortfolioRef');
const notifierStore = useNotifierStore();

const {
    portfolio,
    positions, 
} = defineProps<{
    portfolio: Portfolio.Portfolio;
    positions: Portfolio.CashPosition[]
}>();

const emit = defineEmits(['update:portfolio']);

const isEditing = ref(false);
const inProgress = ref(false);

const totalCost = computed(() => {
    return portfolio.stockPositions.reduce((acc, position) => acc + position.totalCost, 0);
});

const { handleSubmit } = useForm<Portfolio.Update.Request>({
    initialValues: {
        id: portfolio.id,
        title: portfolio.title,
    },
    validationSchema: { title: yup.string().required(t('input.error_required')) },
});

const form = { title: useField<string>('title') };

const onSubmit = handleSubmit(async (formValue) => {
    inProgress.value = true;

    try {
        const params: Portfolio.Update.Request = {
            id: formValue.id,
            title: formValue.title,
        };

        await PortfoliosService.update(params);
        notifierStore.success({ content: '編輯投資組合成功' });
        emit('update:portfolio');
        onCancelEdit();
    } catch (err) {
        console.error(err);
        notifierStore.error({ content: '編輯投資組合失敗' });
    }

    inProgress.value = false;
});

const onConfirmEdit = () => {
    if (form.title.value.value !== portfolio.title) {
        onSubmit();
    } else {
        onCancelEdit();
    }
};

const onEditClick = () => {
    isEditing.value = true;
};

const onCancelEdit = () => {
    isEditing.value = false;
};

const onDeleteClick = () => {
    deletePortfolioRef.value?.show(portfolio);
};
</script>
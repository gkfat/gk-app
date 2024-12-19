<template>
    <v-card
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
                    {{ form.title.value.value }}
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
                <v-btn
                    class="border me-3"
                    :icon="isEditing ? 'mdi-check' :'mdi-pencil'"
                    variant="text"
                    color="primary"
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
import { ref } from 'vue';

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

const {
    handleSubmit, resetForm, setValues,
} = useForm<Portfolio.Update.Request>({
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

        const { title } = await PortfoliosService.update(params);
        setValues({ title });
        notifierStore.success({ content: '編輯投資組合成功' });
        isEditing.value = false;
    } catch (err) {
        console.error(err);
        notifierStore.error({ content: '編輯投資組合失敗' });
    }

    inProgress.value = false;
});

const onEditClick = () => {
    if (!isEditing.value) {
        resetForm();
        isEditing.value = true;
    } else {
        if (form.title.value.value !== portfolio.title) {
            onSubmit();
        }
    }
};

const onDeleteClick = () => {
    deletePortfolioRef.value?.show(portfolio);
};
</script>
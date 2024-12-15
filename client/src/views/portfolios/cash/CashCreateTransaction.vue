<template>
    <v-dialog
        v-model="openDialog"
        persistent
        :max-width="500"
    >
        <v-card
            rounded="lg"
            :loading="inProgress"
            :disabled="inProgress"
        >
            <v-card-title class="text-primary">
                <v-row class="align-center">
                    <v-col
                        cols="auto"
                        class="text-h6"
                    >
                        存入／領回
                    </v-col>
                    <v-col
                        cols="auto"
                        class="ml-auto"
                    >
                        <v-chip label>
                            {{ t(`asset_type.${currentAssetType}`) }}
                        </v-chip>
                    </v-col>
                </v-row>
            </v-card-title>
            <v-card-subtitle>
                帳戶餘額: {{ thousands(instantSummary.remainCash) }}
            </v-card-subtitle>

            <v-card-text class="overflow-y-auto">
                <v-row>
                    <v-col cols="12">
                        <DatePicker
                            v-model="form.tradeDate.value.value"
                            :date-format="'YYYY-MM-DD'"
                            :error-messages="form.tradeDate.errorMessage.value"
                            :label="'交易日期'"
                        />
                    </v-col>

                    <v-col
                        cols="12"
                        sm="4"
                    >
                        <CashFlowDirectionSelector
                            v-model="form.direction.value.value"
                        />
                    </v-col>
                    <v-col
                        cols="12"
                        sm="8"
                    >
                        <v-text-field
                            v-model="form.quantity.value.value"
                            :error-messages="form.quantity.errorMessage.value"
                            rounded="lg"
                            type="number"
                            persistent-placeholder
                            :label="'金額'"
                            :placeholder="'請輸入金額'"
                            hide-details="auto"
                            variant="outlined"
                        />
                    </v-col>
                </v-row>

                <v-row>
                    <v-col cols="12">
                        <v-text-field
                            v-model="form.commission.value.value"
                            :error-messages="form.commission.errorMessage.value"
                            :label="'手續費'"
                            persistent-placeholder
                            :placeholder="`填入手續費(若不需要請填 0)`"
                            rounded="lg"
                            type="number"
                            hide-details="auto"
                            variant="outlined"
                        />
                    </v-col>
                </v-row>
            </v-card-text>
           
            <v-divider />

            <v-card-actions class="flex-wrap">
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
import DatePicker from '@/components/date-picker/DatePicker.vue';
import CashFlowDirectionSelector
    from '@/components/selector/CashFlowDirectionSelector.vue';
import {
    EnumAssetType,
    EnumCashFlow,
} from '@/enums/transaction';
import { useNotifierStore } from '@/store/notifier';
import { Portfolio } from '@/types/portfolio';
import { Transaction } from '@/types/transaction';
import {
    onInputNumberTypeCheck,
    thousands,
} from '@/utils/number';

const { t } = useI18n();
const notifierStore = useNotifierStore();

const inProgress = ref(false);
const openDialog = ref(false);

const toggleDialog = (open: boolean) => {
    openDialog.value = open;
};

const portfolio = ref<Portfolio.Portfolio>();
const currentAssetType = ref(EnumAssetType.STOCK);

const instantSummary = computed(() => ({ remainCash: portfolio.value.cashPositions[0].quantity }));

const {
    handleSubmit, resetForm, setValues, 
} = useForm<Transaction.Create.Request & Transaction.CashTransaction>({
    initialValues: {
        portfolioId: 0,
        tradeDate: new Date().toISOString(),
        commission: null,
        tax: 0,
        direction: EnumCashFlow.DEPOSIT,
        quantity: null,
    },
    validationSchema: {
        commission: yup.number().transform(onInputNumberTypeCheck).required(t('input.error_required')),
        quantity: yup
            .number()
            .transform(onInputNumberTypeCheck)
            .required(t('input.error_required'))
            .default(0)
            .test(
                'account-limit',
                '超過帳戶餘額',
                (value, ctx) => {
                    if (ctx.options.context.direction === EnumCashFlow.WITHDRAW) {
                        return Number(value) <= instantSummary.value.remainCash;
                    }

                    return true;
                }),
    },
});

const form = { 
    portfolioId: useField<number>('portfolioId'),
    tradeDate: useField<Date>('tradeDate'),
    commission: useField<number>('commission'),
    tax: useField<number>('tax'),

    direction: useField<EnumCashFlow>('direction'),
    quantity: useField<number>('quantity'),
};

const emit = defineEmits(['update:transaction']);

const onSubmit = handleSubmit(async (formValue) => {
    inProgress.value = true;

    try {
        const params: Transaction.Create.Request = {
            portfolioId: formValue.portfolioId,
            tradeDate: formValue.tradeDate,
            assetType: currentAssetType.value,
            commission: Number(formValue.commission),
            tax: Number(formValue.tax),
            detail: {
                direction: formValue.direction,
                quantity: Number(formValue.quantity),
            } as Transaction.CashTransaction,
        };

        await PortfoliosService.createTransaction(params);

        emit('update:transaction');
    } catch (err) {
        console.error(err);
        notifierStore.error({ content: '新增交易失敗' });
    }
    inProgress.value = false;
    toggleDialog(false);
});

const show = (data: {
    portfolio: Portfolio.Portfolio,
    assetType: EnumAssetType,
}) => {
    resetForm();

    portfolio.value = data.portfolio;
    currentAssetType.value = data.assetType;
    
    setValues({ portfolioId: data.portfolio.id });

    toggleDialog(true);
};

defineExpose({ show });
</script>

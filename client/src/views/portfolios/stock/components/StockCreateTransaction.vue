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
                        新增交易
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
                </v-row>

                <!-- 股票 -->
                <v-row>
                    <v-col cols="12">
                        <AutoCompleteEx
                            v-model="form.symbol.value.value"
                            :error-messages="form.symbol.errorMessage.value"
                            :label="'標的'"
                            clearable
                            rounded="lg"
                            variant="outlined"
                            :items="marketDataStore.tickers"
                            @update:model-value="onSymbolChange"
                        />
                    </v-col>
                    <v-col
                        cols="12"
                        sm="4"
                    >
                        <TradeDirectionSelector
                            v-model="form.direction.value.value"
                        />
                    </v-col>
                    <v-col
                        cols="12"
                        sm="8"
                    >
                        <v-text-field
                            v-model="form.executionPrice.value.value"
                            :error-messages="form.executionPrice.errorMessage.value"
                            rounded="lg"
                            type="number"
                            persistent-placeholder
                            :prefix="portfolio.currency"
                            :label="'價位'"
                            :placeholder="'請輸入價位（每股）'"
                            hide-details
                            variant="outlined"
                        />
                        <p
                            v-if="currentSymbolLastPrice"
                            class="text-darkgrey text-caption d-flex ga-1"
                        >
                            <span>最新報價:</span>
                            <span class="text-info">{{ currentSymbolLastPrice.lastPrice }}</span>
                            <span>時間:</span>
                            <span class="text-info">{{ timeFormat(currentSymbolLastPrice.lastUpdated) }}</span>
                        </p>
                        <p
                            v-else
                            class="text-darkgrey text-caption"
                        >
                            ＊ 無法取得報價
                        </p>
                    </v-col>
                    <v-col cols="12">
                        <v-text-field
                            v-model="form.quantity.value.value"
                            :error-messages="form.quantity.errorMessage.value"
                            rounded="lg"
                            type="number"
                            persistent-placeholder
                            :label="'數量（股）'"
                            :placeholder="'請輸入數量'"
                            hide-details="auto"
                            variant="outlined"
                            @update:model-value="onQuantityChange"
                        />
                    </v-col>
                </v-row>

                <v-row>
                    <v-col cols="6">
                        <v-text-field
                            v-model="form.commission.value.value"
                            :error-messages="form.commission.errorMessage.value"
                            :label="'手續費'"
                            persistent-placeholder
                            :placeholder="`參考手續費 ${instantSummary.refCommission}`"
                            rounded="lg"
                            type="number"
                            hide-details="auto"
                            variant="outlined"
                        />
                    </v-col>
                    <v-col cols="6">
                        <v-text-field
                            v-model="form.tax.value.value"
                            :error-messages="form.tax.errorMessage.value"
                            :label="'交易稅'"
                            persistent-placeholder
                            :placeholder="`參考交易稅 ${instantSummary.refTax}`"
                            rounded="lg"
                            type="number"
                            hide-details="auto"
                            variant="outlined"
                        />
                    </v-col>
                </v-row>

                <!-- 小計 -->
                <v-table
                    density="compact"
                >
                    <thead>
                        <tr>
                            <th colspan="2">
                                本次交易統計
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>小計</td>
                            <td>{{ thousands(instantSummary.subTotal) }}</td>
                        </tr>
                        <tr>
                            <td>總計</td>
                            <td>{{ thousands(instantSummary.total) }}</td>
                        </tr>
                        <tr>
                            <td>交易後帳戶餘額</td>
                            <td :class="`text-${updownClass(instantSummary.cashAfterTransaction)}`">
                                {{ thousands(instantSummary.cashAfterTransaction) }}
                            </td>
                        </tr>
                    </tbody>
                </v-table>
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
import AutoCompleteEx from '@/components/selector/AutoCompleteEx.vue';
import TradeDirectionSelector
    from '@/components/selector/TradeDirectionSelector.vue';
import {
    EnumAssetType,
    EnumTradeDirection,
} from '@/enums/transaction';
import { useMarketDataStore } from '@/store/market-data';
import { useNotifierStore } from '@/store/notifier';
import { Portfolio } from '@/types/portfolio';
import { Transaction } from '@/types/transaction';
import { updownClass } from '@/utils/common';
import {
    onInputNumberTypeCheck,
    thousands,
} from '@/utils/number';
import { timeFormat } from '@/utils/time';
import { transactionHelper } from '@/utils/transaction';

const { t } = useI18n();
const notifierStore = useNotifierStore();
const marketDataStore = useMarketDataStore();

const inProgress = ref(false);
const openDialog = ref(false);

const toggleDialog = (open: boolean) => {
    openDialog.value = open;
};

const portfolio = ref<Portfolio.Portfolio>();
const currentAssetType = ref(EnumAssetType.STOCK);

const {
    handleSubmit, resetForm, setValues, 
} = useForm<Transaction.Create.Request & Transaction.StockTransaction>({
    initialValues: {
        portfolioId: 0,
        tradeDate: new Date().toISOString(),
        commission: null,
        tax: null,
        direction: EnumTradeDirection.BUY,
        symbol: marketDataStore.tickers[0].value,
        executionPrice: null,
    },
    validationSchema: {
        commission: yup.number().transform(onInputNumberTypeCheck).required(t('input.error_required')),
        tax: yup.number().transform(onInputNumberTypeCheck).required(t('input.error_required')),
        executionPrice: yup.number().transform(onInputNumberTypeCheck).required(t('input.error_required')),
        symbol: yup.string().required(t('input.error_required')),
    },
});

const form = { 
    portfolioId: useField<number>('portfolioId'),
    tradeDate: useField<Date>('tradeDate'),
    commission: useField<number>('commission'),
    tax: useField<number>('tax'),

    direction: useField<EnumTradeDirection>('direction'),
    symbol: useField<string>('symbol'),
    executionPrice: useField<number>('executionPrice'),
    quantity: useField<number>('quantity'),
};

/** 目前最新報價 */
const currentSymbolLastPrice = computed(() => marketDataStore.tickersLastPrices.find((v) => v.symbol === form.symbol.value.value));

/** 更新即時報價 */
const onSymbolChange = async() => {
    await marketDataStore.refreshTickerLastPrice(form.symbol.value.value);

    if (currentSymbolLastPrice.value) {
        setValues({
            executionPrice: Number(currentSymbolLastPrice.value.lastPrice),
            tax: instantSummary.value.refTax,
            commission: instantSummary.value.refCommission,
        });
    }
};

const onQuantityChange = () => {
    if (currentSymbolLastPrice.value) {
        setValues({
            tax: instantSummary.value.refTax,
            commission: instantSummary.value.refCommission,
        });
    }
};

/** 即時試算 */
const instantSummary = computed(() => {
    const remainCash = portfolio.value.cashPositions[0].quantity;
    const executionPrice = Number.isFinite(Number(form.executionPrice.value.value)) ? Number(form.executionPrice.value.value) : 0;
    const quantity = Number.isFinite(Number(form.quantity.value.value)) ? Number(form.quantity.value.value) : 0;
    
    const {
        refTax,
        refCommission,
        subTotal,
        total,
    } = transactionHelper.calcStockSummary({
        direction: form.direction.value.value,
        executionPrice,
        quantity,
    });

    return {
        refCommission,
        refTax,
        subTotal,
        total,
        remainCash,
        cashAfterTransaction: remainCash - total,
    };
});

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
                symbol: formValue.symbol,
                executionPrice: Number(formValue.executionPrice),
                quantity: Number(formValue.quantity),
            } as Transaction.StockTransaction,
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

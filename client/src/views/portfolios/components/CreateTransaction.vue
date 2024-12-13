<template>
    <v-dialog
        v-model="openDialog"
        persistent
        :max-width="700"
    >
        <v-card
            rounded="lg"
            :loading="inProgress"
            :disabled="inProgress"
        >
            <v-card-title class="text-primary">
                新增交易
            </v-card-title>

            <v-card-text>
                <v-row>
                    <v-col cols="12">
                        <v-select
                            v-model="form.assetType.value.value"
                            :label="'資產類型'"
                            :items="selection.assetTypes"
                            hide-details="auto"
                            readonly
                            variant="outlined"
                        />
                    </v-col>
                    <v-col cols="12">
                        <DatePicker
                            v-model="form.tradeDate.value.value"
                            :error-messages="form.tradeDate.errorMessage.value"
                            :label="'交易日期'"
                        />
                    </v-col>
                    <v-col cols="12">
                        <v-text-field
                            v-model="form.commission.value.value"
                            :label="'手續費'"
                            hide-details="auto"
                            variant="outlined"
                        />
                    </v-col>
                    <v-col cols="12">
                        <v-text-field
                            v-model="form.tax.value.value"
                            :label="'交易稅'"
                            hide-details="auto"
                            variant="outlined"
                        />
                    </v-col>
                </v-row>
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

import {
  useField,
  useForm,
} from 'vee-validate';
import { useI18n } from 'vue-i18n';
import * as yup from 'yup';

import DatePicker from '@/components/date-picker';
import { EnumAssetType } from '@/enums/transaction';
import { useNotifierStore } from '@/store/notifier';
import { Transaction } from '@/types/transaction';

const { t } = useI18n();
const notifierStore = useNotifierStore();

const inProgress = ref(false);
const openDialog = ref(false);

const selection = {
    assetTypes: [
        {
            title: t('asset_type.cash'), value: EnumAssetType.CASH, 
        },
        {
            title: t('asset_type.stock'), value: EnumAssetType.STOCK, 
        },
        {
            title: t('asset_type.fx'), value: EnumAssetType.FX, 
        },
    ],
};

const toggleDialog = (open: boolean) => {
    openDialog.value = open;
};

const {
    handleSubmit, resetForm, setValues, 
} = useForm<Transaction.Create.Request>({
    initialValues: {
        portfolioId: 0,
        assetType: EnumAssetType.STOCK,
        tradeDate: null,
        commission: null,
        tax: null,
        detail: null,
    },
});

const form = { 
    portfolioId: useField<number>('portfolioId'),
    assetType: useField<EnumAssetType>('assetType'),
    tradeDate: useField<Date>('tradeDate'),
    commission: useField<number>('commission'),
    tax: useField<number>('tax'),
};

const emit = defineEmits(['submit']);

const onSubmit = handleSubmit(async (formValue) => {
    inProgress.value = true;

    try {
        emit('submit');
    } catch (err) {
        notifierStore.error({ content: '新增交易失敗' });
    }
    inProgress.value = false;
    toggleDialog(false);
});

const show = (data: {
    assetType: EnumAssetType,
    portfolioId: number
}) => {
    setValues({
        portfolioId: data.portfolioId,
        assetType: data.assetType,
    });

    toggleDialog(true);
};

defineExpose({ show });
</script>

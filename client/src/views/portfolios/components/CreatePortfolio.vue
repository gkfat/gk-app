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
            <v-toolbar color="primary">
                <v-card-title>
                    新增投資組合
                </v-card-title>
                <v-btn
                    class="ml-auto"
                    icon="mdi-close"
                    @click="toggleDialog(false)"
                />
            </v-toolbar>

            <v-card-text>
                <v-row class="px-3">
                    <v-col cols="12">
                        <DatePicker
                            v-model="form.createDate.value.value"
                            :error-messages="form.createDate.errorMessage.value"
                            :max-date="maxDate"
                            :label="'起始日期'"
                        />
                    </v-col>
                    <v-col cols="12">
                        <v-autocomplete
                            v-model="form.currency.value.value"
                            :items="currencyCodes"
                            :label="'幣別'"
                            hide-details="auto"
                        />
                    </v-col>
                    <v-col cols="12">
                        <v-text-field
                            v-model="form.title.value.value"
                            :error-messages="form.title.errorMessage.value"
                            hide-details="auto"
                            :label="'名稱'"
                        />
                    </v-col>
                    <v-col cols="12">
                        <v-text-field
                            v-model="form.initialBalance.value.value"
                            :error-messages="form.initialBalance.errorMessage.value"
                            type="number"
                            :label="'起始資金'"
                            :prefix="form.currency.value.value"
                            hide-details="auto"
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

import { codes } from 'currency-codes';
import {
    useField,
    useForm,
} from 'vee-validate';
import { useI18n } from 'vue-i18n';
import * as yup from 'yup';

import { PortfoliosService } from '@/api/portfolios';
import DatePicker from '@/components/date-picker/DatePicker.vue';
import AutoCompleteEx from '@/components/selector/AutoCompleteEx.vue';
import { useNotifierStore } from '@/store/notifier';
import { Portfolio } from '@/types/portfolio';
import { onInputNumberTypeCheck } from '@/utils/number';
import { getRelativeRangeOfDay } from '@/utils/time';

const { t } = useI18n();
const notifierStore = useNotifierStore();

const inProgress = ref(false);
const openDialog = ref(false);
const maxDate = getRelativeRangeOfDay(new Date().getTime()).to.toDate();

const currencyCodes = codes().map((ccy) => ({
    title: ccy,
    value: ccy,
}));

const toggleDialog = (open: boolean) => {
    openDialog.value = open;
};

const {
    handleSubmit, resetForm, setValues, 
} = useForm<Portfolio.Create.Request>({
    initialValues: {
        title: null,
        createDate: new Date().toISOString(),
        currency: '',
        initialBalance: null,
    },
    validationSchema: {
        title: yup.string().required(t('input.error_required')),
        initialBalance: yup.number().transform(onInputNumberTypeCheck).required(t('input.error_required')),
    },
});

const form = { 
    title: useField<string>('title'),
    createDate: useField<Date>('createDate'),
    currency: useField<string>('currency'),
    initialBalance: useField<string>('initialBalance'),
};

const emit = defineEmits(['submit']);

const onSubmit = handleSubmit(async (formValue) => {
    inProgress.value = true;

    try {
        const params: Portfolio.Create.Request = {
            title: formValue.title,
            currency: formValue.currency,
            createDate: formValue.createDate,
            initialBalance: Number(formValue.initialBalance),
        }; 

        await PortfoliosService.create(params);

        emit('submit');
    } catch (err) {
        console.error(err);
        notifierStore.error({ content: '新增投資組合失敗' });
    }
    inProgress.value = false;
    toggleDialog(false);
});

const show = () => {
    resetForm();
    setValues({ currency: currencyCodes[0].value });
    toggleDialog(true);
};

defineExpose({ show });
</script>

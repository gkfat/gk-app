<template>
    <v-select
        v-model="selectedValue"
        :items="itemList"
        rounded="lg"
        hide-details
        variant="outlined"
        @update:model-value="handleModelValueUpdate"
    />
</template>
<script lang="ts" setup>
import { ref } from 'vue';

import { useI18n } from 'vue-i18n';

import { EnumCashFlow } from '@/enums/transaction';

const { t } = useI18n();

const emits = defineEmits(['update:modelValue']);

const selectedValue = ref<EnumCashFlow>(EnumCashFlow.DEPOSIT);

const itemList = [
    {
        title: t(`cashflow_direction.${EnumCashFlow.DEPOSIT}`),
        value: EnumCashFlow.DEPOSIT, 
    }, {
        title: t(`cashflow_direction.${EnumCashFlow.WITHDRAW}`),
        value: EnumCashFlow.WITHDRAW, 
    },
];

const handleModelValueUpdate = () => {
    emits('update:modelValue', selectedValue.value);
};
</script>

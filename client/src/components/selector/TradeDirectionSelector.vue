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

import { EnumTradeDirection } from '@/enums/transaction';

const { t } = useI18n();

const emits = defineEmits(['update:modelValue']);

const selectedValue = ref<EnumTradeDirection>(EnumTradeDirection.BUY);

const itemList = [
    {
        title: t(`trade_direction.${EnumTradeDirection.BUY}`),
        value: EnumTradeDirection.BUY, 
    }, {
        title: t(`trade_direction.${EnumTradeDirection.SELL}`),
        value: EnumTradeDirection.SELL, 
    },
];

const handleModelValueUpdate = () => {
    emits('update:modelValue', selectedValue.value);
};
</script>

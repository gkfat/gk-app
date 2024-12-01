<template>
    <v-dialog
        v-model="openDialog"
        persistent
        max-width="500px"
    >
        <template #activator="{ props}">
            <v-text-field
                v-bind="props"
                rounded="lg"
                :label="customProps.label ?? '選擇日期'"
                :placeholder="customProps.label ?? '選擇日期'"
                readonly
                hide-details="auto"
                variant="outlined"
                :model-value="dateRangeTextFieldValue"
                :error-messages="customProps.errorMessages"
                prepend-inner-icon="mdi-calendar-blank-outline"
                persistent-placeholder
                @click="onInit"
            />
        </template>

        <v-card
            rounded="lg"
        >
            <v-card-title class="bg-primary">
                <v-row class="align-center">
                    <v-col
                        cols="auto"
                        class="text-h6"
                    >
                        選擇日期區間
                    </v-col>
                    <v-col
                        cols="auto"
                        class="ml-auto"
                    >
                        <Btn
                            :color="'white'"
                            :icon="'mdi-close'"
                            :variant="'text'"
                            :exec-func="() => toggleDialog(false)"
                        />
                    </v-col>
                </v-row>
            </v-card-title>

            <v-card-text class="pa-0 overflow-y-auto">
                <vue-date-picker
                    ref="datePickerRef"
                    :model-value="date"
                    :dark="appStore.storage.darkTheme"
                    auto-apply
                    year-first
                    time-picker-inline
                    calendar-cell-class-name="dp-custom-cell"
                    :max-date="customProps.maxDate"
                    :min-date="customProps.minDate"
                    :minutes-grid-increment="5"
                    :minutes-increment="5"
                    locale="zh"
                    inline
                    :format="timeFormat"
                    :enable-seconds="false"
                    :disabled-week-days="customProps.disabledWeekDays ?? undefined"
                    @update:model-value="handleDate"
                />
            </v-card-text>

            <v-divider />

            <v-card-actions class="flex-wrap">
                <v-col
                    cols="12"
                    md="8"
                    class="py-1"
                >
                    {{ timeFormat(date) }}
                </v-col>
                <v-col
                    cols="auto"
                    class="ml-auto py-1"
                >
                    <Btn
                        :color="'success'"
                        :variant="'text'"
                        :exec-func="confirmDateRange"
                        :title="t('button.confirm')"
                    />

                    <Btn
                        :color="'error'"
                        :variant="'text'"
                        :exec-func="() => toggleDialog(false)"
                        :title="t('button.cancel')"
                    />
                </v-col>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script setup lang="ts">
import {
    onMounted,
    ref,
    watch,
} from 'vue';

import { Dayjs } from 'dayjs';
import { useI18n } from 'vue-i18n';

import VueDatePicker, { DatePickerInstance } from '@vuepic/vue-datepicker';
import Btn from '@/components/common/Btn.vue';
import { useAppStore } from '@/store/app';
import {
    createDate,
    timeFormat,
} from '@/utils/time';

const { t } = useI18n();
const openDialog = ref(false);
const appStore = useAppStore();

const datePickerRef = ref<DatePickerInstance>();

const emit = defineEmits(['update:modelValue']);

const customProps = defineProps<{
    modelValue: Date | number,
    errorMessages?: string,
    maxDate?: Date,
    minDate?: Date,
    label?: string;
    disabledWeekDays?: number[];
}>();

const date = ref<Date | number>(new Date());

const handleDate = (d: Date) => {
    date.value = new Date(d);
};

/** 日期區間文字欄的值 */
const dateRangeTextFieldValue = ref('');

/** 刷新日期區間文字欄 */
const refreshDateRangeTextField = () => {
    dateRangeTextFieldValue.value = timeFormat(date.value);
};

const toggleDialog = (open: boolean) => {
    openDialog.value = open;
};

const confirmDateRange = () => {
    refreshDateRangeTextField();
    emit('update:modelValue', date.value);
    toggleDialog(false);
};

/** 計算下一個 5 分鐘的整數位 */
const getNextFiveMinuteInterval = (d: Dayjs) => {
    const minutes = d.minute(); // 獲取當前分鐘
    const remainder = minutes % 5; // 計算餘數

    // 計算下一個 5 分鐘的整數位
    const nextMinutes = minutes + (5 - remainder);
    const newDate = d.minute(nextMinutes); // 設置新的分鐘數

    // 如果分鐘數超過 59，則需要進位到小時
    if (nextMinutes >= 60) {
        newDate.add(1, 'hour'); // 增加一個小時
        newDate.minute(0); // 將分鐘數重置為 0
    }

    return newDate;
};

watch(
    () => customProps.modelValue,
    () => {
        handleDate(new Date(customProps.modelValue));
        refreshDateRangeTextField();
    },
);

onMounted(() => {
    date.value = customProps.modelValue;
    refreshDateRangeTextField();
});

const onInit = () => {
    let result = typeof customProps.modelValue === 'object' || (Number.isFinite(customProps.modelValue) && customProps.modelValue > 0)
        ? createDate(customProps.modelValue)
        : createDate();

    if (customProps.modelValue) {
        const next5minFromNow = getNextFiveMinuteInterval(createDate());
        const next5minFromModelValue = getNextFiveMinuteInterval(createDate(customProps.modelValue));

        if (next5minFromModelValue.diff(next5minFromNow, 'minute') < 5) {
            result = next5minFromNow;
        }
    }

    date.value = result.toDate();

    refreshDateRangeTextField();
    emit('update:modelValue', date.value);
};

const setValue = (timestamp: number) => {
    handleDate(new Date(timestamp));
    confirmDateRange();
};

defineExpose({
    setValue,
});
</script>

<style lang="scss">
.dp__outer_menu_wrap {
    width: 100%;
}

.dp-custom-cell {
    border-radius: 50%;
}

.dp__range_end, .dp__range_start {
    background: rgb(var(--v-theme-primary));
}
.dp__range_between {
    background: rgba(var(--v-theme-primary), 0.2);
}

.dp__inc_dec_button_inline {
    padding: 14px 0px;

    .dp__tp_inline_btn_bar {
        height: 6px;
    }
}

.dp__time_display_inline {
    padding: 5px 10px;
}

.dp--tp-wrap {
    max-width: 100%;
}

.dp__time_picker_inline_container {
    padding-top: 15px;
    padding-bottom: 15px;

    .dp__flex {
        width: 100%;

        .dp__time_input {
            font-size: 18px;
        }
    }
}
</style>

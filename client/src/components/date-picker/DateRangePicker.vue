<template>
    <v-dialog
        v-model="openDialog"
        persistent
        max-width="550px"
    >
        <template #activator="{ props}">
            <v-text-field
                v-bind="props"
                :label="customProps.label ?? '選擇日期'"
                :placeholder="customProps.label ?? '選擇日期'"
                readonly
                hide-details="auto"
                density="compact"
                variant="outlined"
                :model-value="dateRangeTextFieldValue"
                :error-messages="customProps.errorMessages"
                prepend-inner-icon="mdi-calendar-blank-outline"
            />
        </template>

        <v-card rounded="lg">
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
                        <v-btn
                            color="white"
                            icon="mdi-close"
                            variant="text"
                            :disabled="isSelecting"
                            @click="toggleDialog(false)"
                        />
                    </v-col>
                </v-row>
            </v-card-title>

            <v-card-text class="pa-0 overflow-y-auto">
                <vue-date-picker
                    ref="datePickerRef"
                    :model-value="model"
                    :dark="appStore.storage.darkTheme"
                    range
                    auto-apply
                    year-first
                    time-picker-inline
                    calendar-cell-class-name="dp-custom-cell"
                    :max-date="customProps.maxDate ?? undefined"
                    locale="zh"
                    inline
                    :format="datePickerFormatter"
                    :enable-seconds="false"
                    @internal-model-change="onSelect"
                    @update:model-value="handleDate"
                >
                    <!-- left sidebar -->
                    <template #left-sidebar>
                        <v-list flat>
                            <v-list-item
                                v-for="(item, i) in dateRangeSelection"
                                :key="i"
                                class="px-0"
                                variant="text"
                            >
                                <v-btn
                                    block
                                    flat
                                    :text="item.title"
                                    @click="setDateRange(item.value)"
                                />
                            </v-list-item>
                        </v-list>
                    </template>
                </vue-date-picker>
            </v-card-text>

            <v-divider />

            <v-card-actions class="flex-wrap">
                <v-col
                    cols="auto"
                    class="py-1 ml-auto"
                >
                    <v-btn
                        color="success"
                        variant="text"
                        :disabled="isSelecting"
                        :text="t('button.confirm')"
                        @click="confirmDateRange"
                    />

                    <v-btn
                        color="error"
                        variant="text"
                        :disabled="isSelecting"
                        :text="t('button.cancel')"
                        @click="toggleDialog(false)"
                    />
                </v-col>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script setup lang="ts">
import {
    ref,
    toRaw,
    watch,
} from 'vue';

import { useI18n } from 'vue-i18n';

import { Range } from '@/enums/time';
import { useAppStore } from '@/store/app';
import {
    createDate,
    getRelativeRangeOfDay,
    timeFormat,
} from '@/utils/time';
import VueDatePicker, { DatePickerInstance } from '@vuepic/vue-datepicker';

const { t } = useI18n();
const openDialog = ref(false);
const appStore = useAppStore();

const datePickerRef = ref<DatePickerInstance>();

const customProps = defineProps<{
    errorMessages?: string,
    maxDate?: Date,
    label?: string
}>();

const model = defineModel<[Date, Date]>();

const dateRangeSelection = [
    {
        title: '過去一小時', value: Range.HOUR_AGO, 
    },
    {
        title: '今天', value: Range.TODAY, 
    },
    {
        title: '昨天', value: Range.YESTERDAY, 
    },
    {
        title: '過去七天', value: Range.LAST_7_DAYS, 
    },
    {
        title: '未來一個月', value: Range.NEXT_30_DAYS, 
    },
];

const datePickerFormatter = (dates: Date[]) => {
    if (dates.length !== 2) {
        return '';
    }

    const [startDate, endDate] = dates;
    return `${timeFormat(startDate)} ~ ${timeFormat(endDate)}`;
};

const handleDate = (dates: [Date, Date]) => {
    const startDate = new Date(dates[0]);
    const endDate = new Date(dates[1]);

    startDate.setSeconds(0, 0);
    endDate.setSeconds(59, 999);

    model.value = [startDate, endDate];

    refreshDateRangeTextField();
};

/** 日期區間文字欄的值 */
const dateRangeTextFieldValue = ref('');

/** 刷新日期區間文字欄 */
const refreshDateRangeTextField = () => {
    const [startDate, endDate] = model.value || [];

    if (startDate && endDate) {
        dateRangeTextFieldValue.value = datePickerFormatter([startDate, endDate]);
    } else {
        dateRangeTextFieldValue.value = '';
    }
};

/** 是否正在選擇日期 */
const isSelecting = ref(false);

const onSelect = (dates: Date[]) => {
    if (dates) {
        isSelecting.value = toRaw(dates).length === 1;
    }
};

/**
 * 設定日期範圍
 */
const setDateRange = (type: Range) => {
    const now = createDate();

    switch (type) {
    case Range.HOUR_AGO:
        model.value = [now.add(-1, 'hour').toDate(), now.toDate()];
        break;
    case Range.TODAY:
        model.value = [getRelativeRangeOfDay().from.toDate(), getRelativeRangeOfDay().to.toDate()];
        break;
    case Range.YESTERDAY:
        model.value = [getRelativeRangeOfDay(-1).from.toDate(), getRelativeRangeOfDay(-1).to.toDate()];
        break;
    case Range.LAST_7_DAYS:
        model.value = [getRelativeRangeOfDay(-7).from.toDate(), getRelativeRangeOfDay().to.toDate()];
        break;
    case Range.NEXT_30_DAYS:
        model.value = [getRelativeRangeOfDay().from.toDate(), getRelativeRangeOfDay(30).to.toDate()];
        break;
    default: break;
    }
    refreshDateRangeTextField();
};

const toggleDialog = (open: boolean) => {
    openDialog.value = open;
};

const confirmDateRange = () => {
    refreshDateRangeTextField();
    toggleDialog(false);
};

// 同步父層值
watch(
    () => model.value,
    (value) => {
        if (value) {
            refreshDateRangeTextField();
        }
    },
    {
        immediate: true,
        deep: true,
    },
);

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

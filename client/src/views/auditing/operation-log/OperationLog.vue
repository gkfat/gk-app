<template>
    <PageContent
        :loading="inProgress"
        show-go-to-top
    >
        <v-card elevation="2">
            <v-card-title>
                {{ t('nav.operation_log') }}
            </v-card-title>
            <v-card-text>
                <v-row class="align-center">
                    <v-col
                        cols="12"
                        md="6"
                    >
                        <DateRangePicker
                            v-model="form.dateRange.value.value"
                            density="compact"
                        />
                    </v-col>
                </v-row>
        
                <v-row class="align-center">
                    <v-col
                        cols="auto"
                        class="ml-auto"
                    >
                        <v-btn
                            color="primary"
                            append-icon="mdi-reload"
                            @click="onSubmit"
                        >
                            {{ t('button.refresh') }}
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>

        <v-spacer class="mb-3" />
      
        <v-card
            :loading="inProgress"
            elevation="2"
        >
            <v-data-table
                :headers="table.headers"
                :items="table.data"
                :search="table.search"
                density="compact"
                :items-per-page="10"
                :no-data-text="t('common.no_data')"
                class="text-no-wrap"
                item-value="_uid"
                show-expand
                :sort-by="sortOptions"
                :mobile="smAndDown"
            >
                <!-- search bar -->
                <template #top>
                    <v-row
                        class="pa-4 justify-space-between"
                    >
                        <v-col
                            cols="12"
                            sm="4"
                            md="3"
                            class="ml-auto"
                        >
                            <v-text-field
                                v-model="table.search"
                                prepend-inner-icon="mdi-magnify"
                                :placeholder="t('button.search')"
                                type="search"
                                hide-details="auto"
                                variant="underlined"
                                clearable
                            />
                        </v-col>
                    </v-row>
                    <v-divider />
                </template>

                <template #expanded-row="{ item }">
                    <td
                        :colspan="table.headers.length"
                        class="pa-0"
                    >
                        <JsonViewer
                            :value="{
                                request: item.request ?? 'null',
                                result: item.result ?? 'null',
                            }"
                            :expand-depth="2"
                            copyable
                        />
                    </td>
                </template>
            </v-data-table>
        </v-card>
    </PageContent>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import {
    useField,
    useForm,
} from 'vee-validate';
import { useI18n } from 'vue-i18n';
import { useDisplay } from 'vuetify';

import { AuditingService } from '@/api/auditing';
import DateRangePicker from '@/components/date-picker/DateRangePicker.vue';
import JsonViewer from '@/components/json-viewer/JsonViewer.vue';
import PageContent from '@/layouts/panel/PageContent.vue';
import { useNotifierStore } from '@/store/notifier';
import { Common } from '@/types/common';
import { OperationLog } from '@/types/operation-log';
import {
    getRelativeRangeOfDay,
    timeFormat,
} from '@/utils/time';

const notifierStore = useNotifierStore();
const { t } = useI18n();
const { smAndDown } = useDisplay();

const inProgress = ref(false);

const sortOptions: Common.SortItem[] = [
    {
        key: 'logTime', order: 'desc', 
    },
];

type FormValues = {
    dateRange: [Date, Date]
}

const { handleSubmit } = useForm<FormValues>({ initialValues: { dateRange: [getRelativeRangeOfDay().from.toDate(), getRelativeRangeOfDay().to.toDate()] } });

const form = { dateRange: useField<FormValues['dateRange']>('dateRange') };

const table = ref<{
    search: string;
    data: OperationLog.OperationLog[];
    headers: Common.DataTableHeader<OperationLog.OperationLog>[];
}>({
    search: '',
    data: [],
    headers:[
        {
            title: '時間',
            key: 'logTime',
            value: (item) => timeFormat(item.logTime, 'YYYY-MM-DD HH:mm:ss'),
        },
        {
            title: '使用者',
            key: 'user',
            sortable: false,
        },
        {
            title: '路徑',
            key: 'path',
            sortable: false,
        },
        {
            title: '操作',
            key: 'action',
            sortable: false,
        },
        {
            title: 'CODE',
            key: 'resultCode',
            sortable: false,
        },
    ],
});

const onSubmit = handleSubmit(async (formValue) => {
    inProgress.value = true;

    try {
        const params: OperationLog.Search.Request = {
            startDate: formValue.dateRange[0].toISOString(),
            endDate: formValue.dateRange[1].toISOString(),
        };
        
        const rs = await AuditingService.searchOperationLog(params);

        table.value.data = rs.map((item, index) => ({
            ...item,

            _uid: `${item.logTime}-${index}`,
        }));
    } catch {
        notifierStore.error({ content: '查詢操作紀錄失敗' });
    }

    inProgress.value = false;
});
</script>

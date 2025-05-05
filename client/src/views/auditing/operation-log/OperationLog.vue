<template>
    <PageContent
        show-go-to-top
    >
        <PageHeader
            :title="t('nav.operation_log')"
        >
            <template #controlPanel>
                <v-row class="align-center">
                    <v-btn
                        color="info"
                        class="mr-3"
                        append-icon="mdi-reload"
                        @click="onSubmit"
                    >
                        {{ t('button.refresh') }}
                    </v-btn>
                </v-row>
            </template>
        </PageHeader>

        <v-spacer class="mb-3" />
      
        <v-card
            :loading="inProgress"
        >
            <v-data-table
                :headers="table.headers"
                :items="table.data"
                :search="search"
                :items-per-page="-1"
                :no-data-text="t('common.no_data')"
                class="text-no-wrap"
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
                                v-model="search"
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
                                request: item.request ?? null,
                                result: item.result ?? null,
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
import {
    onMounted,
    ref,
} from 'vue';

import { useI18n } from 'vue-i18n';
import { useDisplay } from 'vuetify';

import { OperationLogsService } from '@/api/operation-logs';
import JsonViewer from '@/components/json-viewer/JsonViewer.vue';
import PageContent from '@/layouts/panel/PageContent.vue';
import PageHeader from '@/layouts/panel/PageHeader.vue';
import { useNotifierStore } from '@/store/notifier';
import { Common } from '@/types/common';
import { timeFormat } from '@/utils/time';

import { OperationLog } from '../../../types/operation-log';

const notifierStore = useNotifierStore();
const { t } = useI18n();
const { smAndDown } = useDisplay();

const inProgress = ref(false);
const search = ref('');

const sortOptions: Common.SortItem[] = [
    {
        key: 'endDate', order: 'desc', 
    },
];

const table = ref<{
    data: OperationLog.OperationLog[],
    headers: Common.DataTableHeader<OperationLog.OperationLog>[],
}>({
    data: [],
    headers:[
        {
            title: '時間',
            key: 'endDate',
            value: (item) => timeFormat(item.endDate),
        },
        {
            title: 'Action',
            key: 'action',
            sortable: false,
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
            title: 'CODE',
            key: 'resultCode',
            sortable: false,
        },
    ],
});

const onSubmit = async () => {
    inProgress.value = true;
    try {
        const rs = await OperationLogsService.search({});

        table.value.data = rs;
    } catch {
        notifierStore.error({ content: '取得帳號列表失敗' });
    }
    inProgress.value = false;
};

onMounted(async () => {
    await onSubmit();
});
</script>

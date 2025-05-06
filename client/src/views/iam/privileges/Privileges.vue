<template>
    <PageContent
        :loading="inProgress"
        show-go-to-top
    >
        <v-card elevation="2">
            <v-card-title>
                {{ '權限管理' }}
            </v-card-title>
            <v-card-text>
                <v-row class="align-center">
                    <v-col
                        cols="auto"
                        class="ml-auto"
                    >
                        <v-btn
                            color="info"
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
                :items-per-page="-1"
                :no-data-text="t('common.no_data')"
                class="text-no-wrap"
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

                <template #item.permissions="{item}">
                    <div>
                        <p
                            v-for="(p,i) in item.permissions"
                            :key="i"
                        >
                            {{ p }}
                        </p>
                    </div>
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

import { PrivilegesService } from '@/api/privileges';
import { EnumRoles } from '@/enums/auth';
import PageContent from '@/layouts/panel/PageContent.vue';
import { useNotifierStore } from '@/store/notifier';
import { Common } from '@/types/common';

const notifierStore = useNotifierStore();
const { t } = useI18n();
const { smAndDown } = useDisplay();

const inProgress = ref(false);

const sortOptions: Common.SortItem[] = [
    {
        key: 'id', order: 'desc', 
    },
];

type Privilege = {
    role: EnumRoles;
    permissions: string[];
}

const table = ref<{
    search: string;
    data: Privilege[];
    headers: Common.DataTableHeader<Privilege>[];
}>({
    search: '',
    data: [],
    headers:[
        {
            title: '角色',
            key: 'role',
            value: (item) => t(`role.${item.role}`),
        }, {
            title: '權限',
            key: 'permissions',
            sortable: false,
        },
    ],
});

const onSubmit = async () => {
    inProgress.value = true;

    try {
        const rs = await PrivilegesService.listPermissions();

        table.value.data = rs;
    } catch {
        notifierStore.error({ content: '取得權限列表失敗' });
    }

    inProgress.value = false;
};

onMounted(() => onSubmit());
</script>

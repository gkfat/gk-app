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
                :items-per-page="10"
                density="compact"
                :no-data-text="t('common.no_data')"
                class="text-no-wrap"
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

                <!-- actions -->
                <template #item.actions="{ item }">
                    <template v-if="havePermissionTo.update">
                        <v-btn
                            variant="text"
                            color="darkgrey"
                            icon="mdi-pencil"
                            @click="openEditDescription(item)"
                        />
                    </template>
                </template>
            </v-data-table>
        </v-card>
    </PageContent>

    <EditDescription
        ref="editDescriptionRef"
        @update="onSubmit"
    />
</template>

<script lang="ts" setup>
import {
    onMounted,
    ref,
    useTemplateRef,
} from 'vue';

import { useI18n } from 'vue-i18n';
import { useDisplay } from 'vuetify';

import { PrivilegesService } from '@/api/privileges';
import { Permissions } from '@/enums/permissions';
import PageContent from '@/layouts/panel/PageContent.vue';
import { useAuthStore } from '@/store/auth';
import { useNotifierStore } from '@/store/notifier';
import { Common } from '@/types/common';
import { Privilege } from '@/types/privilege';

import EditDescription from './components/EditDescription.vue';

const notifierStore = useNotifierStore();
const { t } = useI18n();
const authStore = useAuthStore();
const { smAndDown } = useDisplay();

const editDescriptionRef = useTemplateRef('editDescriptionRef');

const inProgress = ref(false);

const havePermissionTo = ref({ update: authStore.havePermission(Permissions.iam.permissions.update) });

const table = ref<{
    search: string;
    data: Privilege.Permission[];
    headers: Common.DataTableHeader<Privilege.Permission>[];
}>({
    search: '',
    data: [],
    headers:[
        {
            title: '權限',
            key: 'permission',
            sortable: false,
        },
        {
            title: '描述',
            key: 'description',
            sortable: false,
        },
        {
            title: '',
            key: 'actions',
            sortable: false,
        },
    ],
});

const openEditDescription = (item: Privilege.Permission) => {
    editDescriptionRef.value?.show(item);
};

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

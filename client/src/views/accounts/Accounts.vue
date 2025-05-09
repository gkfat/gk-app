<template>
    <PageContent
        :loading="inProgress"
        show-go-to-top
    >
        <v-card elevation="2">
            <v-card-title>
                {{ t('nav.accounts') }}
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
                :search="search"
                :items-per-page="10"
                :no-data-text="t('common.no_data')"
                item-key="id"
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

                <!-- enabled -->
                <template #item.enabled="{ item }">
                    <v-chip
                        label
                        variant="outlined"
                        size="small"
                        :color="item.enabled ? 'green' : 'error'"
                        @click="showEnableAccount(item)"
                    >
                        {{ item.enabled }}
                        <v-icon
                            class="ml-1"
                            size="small"
                            icon="mdi-cog"
                        />
                    </v-chip>
                </template>

                <!-- email -->
                <template #item.email="{ item }">
                    <v-row class="ma-0 align-center ga-1">
                        <v-col
                            cols="auto"
                            class="pa-0"
                        >
                            {{ item.email }}
                        </v-col>
                        <v-col
                            cols="auto"
                            class="pa-0"
                        >
                            <v-icon
                                :icon="item.email_verified ? 'mdi-check-circle' : 'mdi-close-circle'"
                                :color="item.email_verified ? 'success' : 'error'"
                            />
                        </v-col>
                    </v-row>
                </template>

                <!-- roles -->
                <template #item.roles="{ value }">
                    <div class="text-wrap">
                        <v-chip
                            v-for="role in value.slice().sort()"
                            :key="role"
                            variant="outlined"
                            color="primary"
                            class="ma-1"
                            small
                        >
                            {{ t('role.'+ role.role) }}
                        </v-chip>
                    </div>
                </template>

                <!-- actions -->
                <template #item.actions="{ item }">
                    <template v-if="havePermissionTo.updateAccount && !isSelf(item.id)">
                        <v-btn
                            variant="text"
                            color="primary"
                            icon="mdi-pencil"
                            @click="showDetail(item, true)"
                        />
                        <v-btn
                            variant="text"
                            color="error"
                            icon="mdi-delete"
                            @click="showDelete(item)"
                        />
                    </template>

                    <!-- 無編輯權限 -->
                    <v-btn
                        v-else
                        variant="text"
                        color="info"
                        icon="mdi-magnify"
                        @click="showDetail(item)"
                    />
                </template>
            </v-data-table>
        </v-card>
    </PageContent>

    <AccountDetail
        ref="accountDetailRef"
        @update:detail="onSubmit"
    />
    <EnableAccount
        ref="enableAccountRef"
        @update:enabled="onSubmit"
    />
    <DeleteAccount
        ref="deleteAccountRef"
        @update:delete="onSubmit"
    />
</template>

<script lang="ts" setup>
import {
    onMounted,
    ref,
} from 'vue';

import { useI18n } from 'vue-i18n';
import { useDisplay } from 'vuetify';

import { AccountsService } from '@/api/accounts';
import { Permissions } from '@/enums/permissions';
import PageContent from '@/layouts/panel/PageContent.vue';
import { useAuthStore } from '@/store/auth';
import { useNotifierStore } from '@/store/notifier';
import { Account } from '@/types/account';
import { Common } from '@/types/common';
import {
    createDate,
    timeFormat,
} from '@/utils/time';
import { templateRef } from '@vueuse/core';

import AccountDetail from './components/AccountDetail.vue';
import DeleteAccount from './components/DeleteAccount.vue';
import EnableAccount from './components/EnableAccount.vue';

const notifierStore = useNotifierStore();
const authStore = useAuthStore();
const { t } = useI18n();
const { smAndDown } = useDisplay();

const accountDetailRef = templateRef('accountDetailRef');
const enableAccountRef = templateRef('enableAccountRef');
const deleteAccountRef = templateRef('deleteAccountRef');

/**
 * 操作權限
 */
const havePermissionTo = ref({
    addAccount: authStore.havePermission(Permissions.account.accounts.add),
    updateAccount: authStore.havePermission(Permissions.account.accounts.update),
    deleteAccount: authStore.havePermission(Permissions.account.accounts.delete),
});

const inProgress = ref(false);
const search = ref('');

const isSelf = (id: number) => id === authStore.state.account.id;

const sortOptions: Common.SortItem[] = [
    {
        key: 'id', order: 'desc', 
    },
];

const table = ref<{
    data: Account.Account[],
    headers: Common.DataTableHeader<Account.Account>[],
}>({
    data: [],
    headers:[
        {
            title: 'ID',
            key: 'id',
        },
        {
            title: '啟用',
            key: 'enabled',
            sortable: false,
        },
        {
            title: '名稱',
            key: 'name',
            sortable: false,
        },
        {
            title: '信箱',
            key: 'email',
            sortable: false,
        },
        {
            title: '角色',
            key: 'roles',
            sortable: false,
        },
        {
            title: '最後登入時間',
            key: 'lastLoginAt',
            value: (item) => createDate(item.last_login_at).fromNow(),
        },
        {
            title: '建立時間',
            key: 'createAt',
            value: (item) => timeFormat(item.create_at),
        },
        {
            title: '操作',
            key: 'actions',
            sortable: false,
        },
    ],
});

const onSubmit = async () => {
    inProgress.value = true;
    try {
        table.value.data = await AccountsService.list();

    } catch {
        notifierStore.error({ content: '取得帳號列表失敗' });
    }
    inProgress.value = false;
};

const showDetail = (data: Account.Account, editable = false) => {
    accountDetailRef.value?.show(data, editable);
};

const showEnableAccount = (data: Account.Account) => {
    if (havePermissionTo.value.updateAccount && !isSelf(data.id)) {
        enableAccountRef.value?.show(data);
    }
};

const showDelete = (data: Account.Account) => {
    if (havePermissionTo.value.deleteAccount && !isSelf(data.id)) {
        deleteAccountRef.value?.show(data);
    }
};

onMounted(() => onSubmit());
</script>

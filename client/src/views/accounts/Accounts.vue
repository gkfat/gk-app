<template>
    <PageContent
        :loading="inProgress"
        show-go-to-top
    >
        <PageHeader
            :title="t('nav.accounts')"
        >
            <template #controlPanel>
                <v-row class="align-center">
                    <v-btn
                        color="info"
                        class="mr-3"
                        append-icon="mdi-reload"
                        @click="listAccounts"
                    >
                        {{ t('button.refresh') }}
                    </v-btn>
                </v-row>
            </template>
        </PageHeader>

        <v-spacer class="mb-3" />
      
        <v-card
            :loading="inProgress"
            flat
        >
            <v-card class="py-4">
                <v-data-table
                    :headers="table.headers"
                    :items="table.data"
                    :search="search"
                    :items-per-page="-1"
                    :no-data-text="t('common.no_data')"
                    item-key="id"
                    class="text-no-wrap"
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
                                {{ role.role }}
                            </v-chip>
                        </div>
                    </template>

                    <!-- actions -->
                    <template #item.actions="{ item }">
                        <template v-if="havePermissionTo.updateAccount && !isSelf(item.id)">
                            <v-btn
                                variant="text"
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
        </v-card>
    </PageContent>

    <AccountDetail
        ref="accountDetailRef"
        @update:detail="listAccounts"
    />
    <EnableAccount
        ref="enableAccountRef"
        @update:enabled="listAccounts"
    />
    <DeleteAccount
        ref="deleteAccountRef"
        @update:delete="listAccounts"
    />
</template>

<script lang="ts" setup>
import {
    onMounted,
    ref,
} from 'vue';

import { useI18n } from 'vue-i18n';

import { AccountsService } from '@/api/accounts';
import { Permissions } from '@/enums/permissions';
import PageContent from '@/layouts/panel/PageContent.vue';
import PageHeader from '@/layouts/panel/PageHeader.vue';
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
        },
        {
            title: '名稱',
            key: 'name',
        },
        {
            title: '信箱',
            key: 'email',
        },
        {
            title: '角色',
            key: 'roles',
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

const listAccounts = async () => {
    inProgress.value = true;
    try {
        table.value.data = await AccountsService.list();
    } catch {
        notifierStore.error({ content: '取得帳號列表失敗' });
    }
    inProgress.value = false;
};

const showDetail = (data: Account.Account, editable = false) => {
    if (accountDetailRef.value) {
        accountDetailRef.value.show(data, editable);
    }
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

onMounted(async () => {
    await listAccounts();
});
</script>

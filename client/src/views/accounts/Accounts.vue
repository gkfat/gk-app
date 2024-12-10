<template>
    <PageContent
        :loading="inProgress"
        show-go-to-top
    >
        <v-card class="mb-5">
            <v-card-title>
                {{ t('nav.accounts') }}
            </v-card-title>
            <v-card-text>
                <v-row>
                    <v-col
                        cols="auto"
                        class="ml-auto"
                    >
                        <v-btn
                            color="info"
                            class="mr-3"
                            append-icon="mdi-reload"
                            @click="listAccounts"
                        >
                            {{ t('button.refresh') }}
                        </v-btn>
                        <v-btn
                            v-if="havePermissionTo.addAccount"
                            color="success"
                            append-icon="mdi-plus"
                            @click="showAddAccount()"
                        >
                            {{ t('button.create') }}
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>

        <v-card :loading="inProgress">
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
                                    :label="t('button.search')"
                                    type="search"
                                    hide-details="auto"
                                    density="compact"
                                    variant="outlined"
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
                        <template v-if="havePermissionTo.updateAccount">
                            <v-btn
                                variant="text"
                                icon="mdi-pencil"
                                @click="showDetail(item, true)"
                            />
                            <v-btn
                                v-if="item.id !== authStore.state.account.id"
                                variant="text"
                                color="error"
                                icon="mdi-delete"
                                @click="showDelete(item)"
                            />
                        </template>

                        <!-- 無編輯權限 -->
                        <v-btn
                            v-else
                            density="comfortable"
                            variant="text"
                            color="primary"
                            icon="mdi-magnify"
                            @click="showDetail(item)"
                        />
                    </template>
                </v-data-table>
            </v-card>
        </v-card>
    </PageContent>

    <AddAccount
        ref="addAccountRef"
        @update:add="listAccounts"
    />
    <AccountDetail
        ref="accountDetailRef"
        @update:detail="listAccounts"
    />
    <EnableAccount
        ref="EnableAccountRef"
        @update:enabled="listAccounts"
    />
    <DialogDelete
        ref="dialogDeleteRef"
        @update:delete="listAccounts"
    />
</template>

<script lang="ts" setup>
import {
  onMounted,
  ref,
} from 'vue';

import { useI18n } from 'vue-i18n';

import { AccountService } from '@/api/account';
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

// import AccountDetail from './components/AccountDetail.vue';
// import AddAccount from './components/AddAccount.vue';
// import DialogDelete from './components/DialogDelete.vue';
import EnableAccount from './components/EnableAccount.vue';

const notifierStore = useNotifierStore();
const authStore = useAuthStore();
const { t } = useI18n();

const accountDetailRef = templateRef('accountDetailRef');
const EnableAccountRef = templateRef('EnableAccountRef');
const dialogDeleteRef = templateRef('dialogDeleteRef');
const addAccountRef = templateRef('addAccountRef');

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
            title: 'Enable',
            key: 'enabled',
        },
        {
            title: 'Name',
            key: 'name',
        },
        {
            title: 'Email',
            key: 'email',
        },
        {
            title: 'Roles',
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
            align: 'center',
        },
    ],
});

const listAccounts = async () => {
    inProgress.value = true;
    try {
        table.value.data = await AccountService.list();
    } catch {
        notifierStore.error({ content: '取得帳號列表失敗' });
    }
    inProgress.value = false;
};

const showAddAccount = () => {
    if (addAccountRef.value) {
        addAccountRef.value.show();
    }
};

const showDetail = (data: Account.Account, editable = false) => {
    if (accountDetailRef.value) {
        accountDetailRef.value.show(data, editable);
    }
};

const showEnableAccount = (data: Account.Account) => {
    if (havePermissionTo.value.updateAccount && data.id !== authStore.state.account.id) {
        EnableAccountRef.value?.show(data);
    }
};

const showDelete = (data: Account.Account) => {
    if (dialogDeleteRef.value) {
        dialogDeleteRef.value.show(data);
    }
};

onMounted(async () => {
    await listAccounts();
});
</script>

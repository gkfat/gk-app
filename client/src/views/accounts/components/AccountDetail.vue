<template>
    <v-dialog
        v-model="openDialog"
        persistent
        max-width="600px"
    >
        <v-card
            v-if="data"
            :loading="inProgress"
            :disabled="inProgress"
        >
            <v-toolbar color="primary">
                <v-card-title>
                    {{ editable ? t('button.edit') : t('button.detail') }}
                </v-card-title>
                <v-btn
                    class="ml-auto"
                    icon="mdi-close"
                    @click="toggleDialog(false)"
                />
            </v-toolbar>

            <v-card-text>
                <v-form
                    validate-on="input"
                    :readonly="!editable"
                >
                    <v-row>
                        <v-col cols="4">
                            <v-text-field
                                v-model="data.id"
                                label="ID"
                                hide-details
                                variant="outlined"
                                readonly
                            />
                        </v-col>
                        <v-col>
                            <v-text-field
                                v-model="data.email"
                                label="Email"
                                hide-details
                                variant="outlined"
                                readonly
                            />
                        </v-col>
                    </v-row>
                    <!-- name -->
                    <v-row>
                        <v-col>
                            <v-text-field
                                v-model="data.name"
                                label="名稱"
                                hide-details
                                variant="outlined"
                                readonly
                            />
                        </v-col>
                    </v-row>
                    <!-- roles -->
                    <v-row>
                        <v-col>
                            <v-autocomplete
                                v-model="data.roles"
                                :items="rolesData"
                                item-title="role"
                                :readonly="!editable || !havePermissionTo.update"
                                label="角色"
                                :clearable="editable"
                                chips
                                closable-chips
                                hide-no-data
                                multiple
                                return-object
                                variant="outlined"
                                hide-details
                            >
                                <template #chip="{ props, item }">
                                    <v-chip
                                        v-bind="props"
                                        color="primary"
                                    >
                                        {{ item.title }}
                                    </v-chip>
                                </template>
                            </v-autocomplete>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>

            <v-divider />

            <v-card-actions>
                <v-spacer />
                <v-btn
                    v-if="editable"
                    color="success"
                    @click="onSubmit"
                >
                    {{ t('button.confirm') }}
                </v-btn>
                <v-btn
                    color="cancel"
                    @click="toggleDialog(false)"
                >
                    {{ t('button.cancel') }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts" setup>
import {
    computed,
    ref,
} from 'vue';

import { useI18n } from 'vue-i18n';

import { AccountsService } from '@/api/accounts';
import { PrivilegesService } from '@/api/privileges';
import { Permissions } from '@/enums/permissions';
import { useAuthStore } from '@/store/auth';
import { useNotifierStore } from '@/store/notifier';
import { Account } from '@/types/account';
import { Role } from '@/types/role';

const { t } = useI18n();
const notifierStore = useNotifierStore();
const authStore = useAuthStore();

const havePermissionTo = ref({ update: authStore.havePermission(Permissions.account.accounts.update) });

const data = ref<Account.Account>(null);
const editable = ref(false);
const inProgress = ref(false);
const openDialog = ref(false);

const rolesData = ref<Role.Role[]>([]);

const fetchRolesData = async () => {
    if (rolesData.value.length) return;

    try {
        const res = await PrivilegesService.listRoles();
        rolesData.value = res.filter((role) => role.role !== 'super');
    } catch (error) {
        notifierStore.error({ content: '取得角色列表失敗' });

        throw error;
    }
};

const setReadonlyData = () => {
    rolesData.value = data.value?.roles || [];
};

const toggleDialog = (open: boolean) => {
    openDialog.value = open;
};

const emit = defineEmits(['update:detail']);

const onSubmit = async () => {
    inProgress.value = true;

    const { id } = data.value;

    try {
        const roleIdList = data.value.roles.map((r) => r.id);
        await AccountsService.updateRoles(id, roleIdList);

        emit('update:detail');
        notifierStore.success({ content: '變更會員資訊成功' });
    } catch (error) {
        notifierStore.error({ content: '變更會員資訊失敗' });
    }

    inProgress.value = false;
    toggleDialog(false);
};

const show = async (account: Account.Account, edit: boolean) => {
    data.value = JSON.parse(JSON.stringify(account));
    editable.value = edit;

    // 有編輯權限才須 fetch all roles data
    if (edit) {
        await fetchRolesData();
    } else {
        setReadonlyData();
    }

    toggleDialog(true);
};

defineExpose({ show });

</script>

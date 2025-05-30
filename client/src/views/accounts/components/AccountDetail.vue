<template>
    <v-dialog
        v-model="openDialog"
        persistent
        max-width="600px"
    >
        <v-card
            v-if="account"
            :loading="inProgress"
            :disabled="inProgress"
        >
            <v-toolbar color="primary">
                <v-card-title>
                    {{ isEditing ? t('button.edit') : t('button.detail') }}
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
                    :readonly="!isEditing"
                >
                    <v-row class="align-center">
                        <v-col
                            cols="12"
                            sm="4"
                            class="text-secondary text-no-wrap"
                        >
                            頭像
                        </v-col>

                        <v-col>
                            <v-avatar
                                color="primary"
                                rounded="lg"
                            >
                                <v-img
                                    v-if="account.avatar"
                                    alt="avatar"
                                    :src="account.avatar"
                                />

                                <v-icon
                                    v-else
                                    icon="mdi-account"
                                />
                            </v-avatar>
                        </v-col>
                    </v-row>
                
                    <v-row class="align-center">
                        <v-col
                            cols="12"
                            sm="4"
                            class="text-secondary text-no-wrap"
                        >
                            編號
                        </v-col>
                        <v-col>
                            {{ account.id }}
                        </v-col>
                    </v-row>
                
                    <v-row class="align-center">
                        <v-col
                            cols="12"
                            sm="4"
                            class="text-secondary text-no-wrap"
                        >
                            使用者名稱
                        </v-col>

                        <v-col>
                            {{ account.name }}
                        </v-col>
                    </v-row>

                    <v-row class="align-center">
                        <v-col
                            cols="12"
                            sm="4"
                            class="text-secondary text-no-wrap"
                        >
                            Email
                        </v-col>

                        <v-col>
                            {{ account.email }}
                        </v-col>
                    </v-row>
                   
                    <v-row class="align-center">
                        <v-col
                            cols="12"
                            sm="4"
                            class="text-secondary text-no-wrap"
                        >
                            角色
                        </v-col>
                        
                        <v-col>
                            <v-autocomplete
                                v-model="accountRoles"
                                :items="rolesSelection"
                                :readonly="!isEditing || !havePermissionTo.update"
                                :clearable="isEditing"
                                chips
                                closable-chips
                                hide-no-data
                                density="compact"
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
                    v-if="isEditing"
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
import { EnumRoles } from '@/enums/auth';
import { Permissions } from '@/enums/permissions';
import { useAuthStore } from '@/store/auth';
import { useNotifierStore } from '@/store/notifier';
import { Account } from '@/types/account';
import { Privilege } from '@/types/privilege';

const { t } = useI18n();
const notifierStore = useNotifierStore();
const authStore = useAuthStore();

const havePermissionTo = ref({ update: authStore.havePermission(Permissions.account.accounts.update) });

const account = ref<Account.Account>(null);
const isEditing = ref(false);
const inProgress = ref(false);
const openDialog = ref(false);

const rolesData = ref<Privilege.Role[]>([]);
const rolesSelection = computed(() => rolesData.value
    .map((v) => ({
        title: t(`role.${v.role}`),
        value: v.id,
    })),
);

const accountRoles = computed(() => {
    const res = account.value?.roles?.map((v) => ({
        title: t(`role.${v.role}`),
        value: v.id,
    })) || [];

    return res;
});

const fetchRolesData = async () => {
    if (rolesData.value.length) return;

    try {
        const res = await PrivilegesService.listRoles();
        
        rolesData.value = res;
    } catch (error) {
        notifierStore.error({ content: '取得角色列表失敗' });

        throw error;
    }
};

const setReadonlyData = () => {
    rolesData.value = account.value?.roles.filter((v)=> v.role !== EnumRoles.SUPER) || [];
};

const toggleDialog = (open: boolean) => {
    openDialog.value = open;
};

const emit = defineEmits(['update:detail']);

const onSubmit = async () => {
    inProgress.value = true;

    const { id } = account.value;

    try {
        const roleIdList = account.value.roles.map((r) => r.id);

        await AccountsService.updateRoles(id, roleIdList);

        emit('update:detail');
        notifierStore.success({ content: '變更會員資訊成功' });
    } catch (error) {
        notifierStore.error({ content: '變更會員資訊失敗' });
    }

    inProgress.value = false;
};

const show = async (data: Account.Account, editable: boolean) => {
    account.value = JSON.parse(JSON.stringify(data));
    
    isEditing.value = editable;

    if (editable) {
        await fetchRolesData();
    } else {
        setReadonlyData();
    }

    toggleDialog(true);
};

defineExpose({ show });

</script>

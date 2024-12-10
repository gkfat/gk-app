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
                <v-toolbar-title class="text-h6 font-weight-medium">
                    {{ dialogTitle }}
                </v-toolbar-title>
                <v-btn
                    icon="mdi-close"
                    @click="toggleDialog(false)"
                />
            </v-toolbar>

            <v-card-text>
                <v-form
                    validate-on="input"
                    :readonly="!editable"
                >
                    <!-- id & email -->
                    <v-row>
                        <v-col cols="4">
                            <v-text-field
                                v-model="data.id"
                                :label="t('common_label.account_id')"
                                hide-details
                                variant="outlined"
                                readonly
                            />
                        </v-col>
                        <v-col>
                            <v-text-field
                                v-model="data.email"
                                :label="t('common_label.account')"
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
                                v-model="form.name.value.value"
                                :label="t('common_label.name')"
                                :error-messages="form.name.errorMessage.value"
                                hide-details="auto"
                                variant="outlined"
                                autofocus
                                required
                            />
                        </v-col>
                    </v-row>
                    <!-- roles -->
                    <v-row>
                        <v-col>
                            <v-autocomplete
                                v-model="form.roles.value.value"
                                :items="rolesData"
                                item-title="role"
                                :readonly="!editable || !havePermissionTo.updateRoles"
                                :label="t('account_list.label_roles')"
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
                    <!-- 整合商 -->
                    <v-row>
                        <v-col>
                            <v-autocomplete
                                v-model="form.integratorScopes.value.value"
                                :items="integratorStore.integratorIdList"
                                :readonly="!editable || !havePermissionTo.updateIntegratorScope"
                                :label="t('account_list.label_integrator_scope')"
                                :clearable="editable"
                                chips
                                closable-chips
                                hide-no-data
                                multiple
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
                    @click="submit()"
                >
                    {{ t('button.save') }}
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

<script setup>
import {
    computed,
    ref,
} from 'vue';
import { useI18n } from 'vue-i18n';

import {
    useField,
    useForm,
} from 'vee-validate';
import * as yup from 'yup';

import { Permissions } from '@/common/enums/permissions';

import { AccountsService } from '@/common/api/accounts';
import { PrivilegeService } from '@/common/api/privilege';

import { useIntegratorStore } from '@/common/stores/integrator';
import { useNotifierStore } from '@/common/stores/notifier';
import { useUserStore } from '@/common/stores/user';
import {
    useNotifierErrorHandler,
} from '@/common/composables/useNotifierErrorHandler';

const { t } = useI18n();
const notifierStore = useNotifierStore();
const integratorStore = useIntegratorStore();
const userStore = useUserStore();
const { errorHandler } = useNotifierErrorHandler(true);

/**
 * 操作權限
 */
const havePermissionTo = ref({
    updateRoles: userStore.havePermission(Permissions.account.accounts.updateRoles),
    updateIntegratorScope: userStore.havePermission(Permissions.account.accounts.updateIntegratorScope),
});

/** @type {import('vue').Ref<App.Api.Accounts.Account | null>} */
const data = ref(null);
const editable = ref(false);
const inProgress = ref(false);
const openDialog = ref(false);

const dialogTitle = computed(() => (editable.value
    ? t('common_label.edit')
    : t('common_label.detail')));

/**
 * 所有權限
 * @type {import('vue').Ref<App.Api.Accounts.Role[]>}
 */
const rolesData = ref([]);

const fetchRolesData = async () => {
    if (rolesData.value.length) return;

    try {
        const res = await PrivilegeService.getRoleList();
        rolesData.value = res.map((item) => item.role).filter((r) => r.role !== 'super');
    } catch (error) {
        errorHandler(error);

        throw error;
    }
};

const setReadonlyData = () => {
    rolesData.value = data.value?.roles || [];
};

/**
 * 開關 dialog
 * @param {boolean} open
 */
const toggleDialog = (open) => {
    openDialog.value = open;
};

const emit = defineEmits(['update:detail']);

// name regex rule
const regexName = /^[^\s\-+*/\\=|!@#$%^&,.:;?'"[\]<>]+(?: [^\s\-+*/\\=|!@#$%^&,.:;?'"[\]<>]+)*$/gi;

const { handleSubmit, resetForm } = useForm({
    initialValues: {
        name: '',
        /** @type {App.Api.Accounts.Role[]} */
        roles: [],
        /** @type {string[]} */
        integratorScopes: [],
    },
    validationSchema: yup.object({
        name: yup
            .string()
            .max(100, t('input_error.max_length', { maxLen: 100 }))
            .required(t('input_error.required'))
            .matches(regexName, t('input_error.name_rule_invalid_character')),
    }),
});

const form = {
    /** @type {import('vee-validate').FieldContext<string>} */
    name: useField('name'),
    /** @type {import('vee-validate').FieldContext<App.Api.Accounts.Role[]>} */
    roles: useField('roles'),
    /** @type {import('vee-validate').FieldContext<string[]>} */
    integratorScopes: useField('integratorScopes'),
};

// submit form
const submit = handleSubmit(async (formValue) => {
    inProgress.value = true;

    if (!data.value) {
        return;
    }

    const { id } = data.value;

    const {
        name,
        roles,
        integratorScopes,
    } = formValue;
    /**
     * @param {string | string[] | App.Api.Accounts.Role[]} a
     * @param {string | string[] | App.Api.Accounts.Role[]} b
     */
    const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b);

    try {
        if (!equal(data.value.name, name)) {
            await AccountsService.changeName(id, name);
        }

        if (!equal(data.value.roles, roles)) {
            const roleIdList = roles.map((r) => r.id);
            await AccountsService.updateRoles(id, roleIdList);
        }

        if (!equal(data.value.integratorScopes, integratorScopes)) {
            await AccountsService.updateIntegratorScope(id, integratorScopes);
        }

        emit('update:detail');
        notifierStore.success({
            content: t('account_list.message_update_account_success', { account: `${data.value.id} - ${data.value.email}` }),
        });
    } catch (error) {
        errorHandler(error);
    }

    inProgress.value = false;
    toggleDialog(false);
});

/**
 * @param {App.Api.Accounts.Account} account
 * @param {boolean} edit
 */
const show = async (account, edit) => {
    data.value = account;
    editable.value = edit;

    resetForm();

    // set form data
    form.name.setValue(data.value.name);
    form.roles.setValue(data.value.roles);
    form.integratorScopes.setValue(data.value.integratorScopes);

    // 有編輯權限才須 fetch all roles data
    if (edit) {
        await fetchRolesData();
    } else {
        setReadonlyData();
    }

    toggleDialog(true);
};

defineExpose({
    show,
});

</script>

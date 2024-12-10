<template>
    <v-dialog
        v-model="openDialog"
        persistent
        max-width="600px"
    >
        <v-card
            :loading="inProgress"
            :disabled="inProgress"
        >
            <v-toolbar color="success">
                <v-toolbar-title class="text-h5 font-weight-medium">
                    {{ t('account_list.title_add') }}
                </v-toolbar-title>
                <v-btn
                    icon="mdi-close"
                    @click="toggleDialog(false)"
                />
            </v-toolbar>

            <v-card-text>
                <v-form validate-on="input">
                    <v-row>
                        <!-- email -->
                        <v-col cols="12">
                            <v-text-field
                                v-model="form.email.value.value"
                                :label="t('common_label.account')"
                                :error-messages="form.email.errorMessage.value"
                                hide-details="auto"
                                variant="outlined"
                                autofocus
                                required
                            />
                        </v-col>
                        <!-- name -->
                        <v-col cols="12">
                            <v-text-field
                                v-model="form.name.value.value"
                                :label="t('common_label.name')"
                                :error-messages="form.name.errorMessage.value"
                                autocomplete="username"
                                hide-details="auto"
                                variant="outlined"
                                required
                            />
                        </v-col>

                        <!-- New password -->
                        <v-col cols="12">
                            <v-text-field
                                v-model="form.password.value.value"
                                type="password"
                                :error-messages="form.password.errorMessage.value"
                                :label="t('account_list.label_set_password')"
                                autocomplete="new-password"
                                hide-details="auto"
                                variant="outlined"
                                required
                            />
                        </v-col>

                        <!-- roles -->
                        <v-col cols="12">
                            <v-autocomplete
                                v-model="form.roles.value.value"
                                :items="rolesData"
                                item-title="role"
                                item-value="id"
                                :readonly="!havePermissionTo.updateRoles"
                                :label="t('account_list.label_roles')"
                                clearable
                                chips
                                closable-chips
                                hide-no-data
                                multiple
                                variant="outlined"
                                hide-details="auto"
                                required
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

                        <v-col cols="12">
                            <v-autocomplete
                                v-model="form.integratorScopes.value.value"
                                :items="integratorStore.integratorIdList"
                                item-title="code"
                                item-value="id"
                                :label="t('account_list.label_integrator_scope')"
                                chips
                                closable-chips
                                hide-no-data
                                multiple
                                variant="outlined"
                                hide-details
                                required
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
                    color="success"
                    @click="submit()"
                >
                    {{ t('button.add') }}
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
import { ref } from 'vue';
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
const userStore = useUserStore();
const integratorStore = useIntegratorStore();
const { errorHandler } = useNotifierErrorHandler(true);

/**
 * 操作權限
 */
const havePermissionTo = ref({
    updateRoles: userStore.havePermission(Permissions.account.accounts.add),
});

const inProgress = ref(false);
const openDialog = ref(false);

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
    } catch (err) {
        errorHandler(err);
        throw err;
    }
};

/**
 * 開關 dialog
 * @param {boolean} open
 */
const toggleDialog = (open) => {
    openDialog.value = open;
};

const emit = defineEmits(['update:add']);

// name regex rule
const regexName = /^[^\s\-+*/\\=|!@#$%^&,.:;?'"[\]<>]+(?: [^\s\-+*/\\=|!@#$%^&,.:;?'"[\]<>]+)*$/gi;

// regex 檢查至少含 1 英文字及 1 數字
const regexPasswordFormat = /^(?=.*[0-9])(?=.*[a-zA-Z]).+$/;

const { handleSubmit, resetForm } = useForm({
    initialValues: /** @type {App.Api.Accounts.CreateAccount.Request} */ ({
        email: '',
        name: '',
        password: '',
        roles: [],
        integratorScopes: [],
    }),
    validationSchema: yup.object({
        email: yup
            .string()
            .min(6, t('input_error.account_format'))
            .max(12, t('input_error.account_format'))
            .matches(/^(?=.*[A-Za-z])(?=.*\d).+$/, t('input_error.account_format'))
            .required(t('input_error.required')),
        password: yup
            .string()
            .min(6, t('input_error.password_format'))
            .max(12, t('input_error.password_format'))
            .matches(regexPasswordFormat, t('input_error.password_format'))
            .required(t('input_error.required')),
        name: yup
            .string()
            .max(100, t('input_error.max_length', { maxLen: 100 }))
            .required(t('input_error.required'))
            .matches(regexName, t('input_error.name_rule_invalid_character')),
    }),
});

const form = {
    email: useField('email'),
    name: useField('name'),
    password: useField('password'),
    roles: useField('roles'),
    integratorScopes: useField('integratorScopes'),
};

const show = async () => {
    await fetchRolesData();
    resetForm();
    toggleDialog(true);
};

defineExpose({
    show,
});

/** @param {App.Api.Accounts.CreateAccount.Request} newAccount */
const addAccount = async (newAccount) => {
    try {
        await AccountsService.addAccount(newAccount);

        emit('update:add');
        notifierStore.success({
            content: t('account_list.message_add_account_success'),
        });
    } catch (err) {
        errorHandler(err);
    }
};

// submit form
const submit = handleSubmit(async (value) => {
    inProgress.value = true;
    await addAccount(value);
    inProgress.value = false;
    toggleDialog(false);
});

</script>

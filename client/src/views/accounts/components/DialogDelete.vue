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
            <v-toolbar color="error">
                <v-toolbar-title class="text-h6 font-weight-medium">
                    {{ t('account_list.title_delete') }}
                </v-toolbar-title>
                <v-btn
                    icon="mdi-close"
                    @click="toggleDialog(false)"
                />
            </v-toolbar>

            <v-card-text>
                {{ t('account_list.message_confirm_delete', { account: `${data.id} - ${data.email}` }) }}
            </v-card-text>

            <v-divider />

            <v-card-actions>
                <v-spacer />
                <v-btn
                    color="error"
                    @click="del()"
                >
                    {{ t('button.delete') }}
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

import { AccountsService } from '@/common/api/accounts';

import {
    useNotifierErrorHandler,
} from '@/common/composables/useNotifierErrorHandler';

const { t } = useI18n();
const { errorHandler } = useNotifierErrorHandler(true);

/** @type {import('vue').Ref<App.Api.Accounts.Account | null>} */
const data = ref(null);
const inProgress = ref(false);
const openDialog = ref(false);

/**
 * 開關 dialog
 * @param {boolean} open
 */
const toggleDialog = (open) => {
    openDialog.value = open;
};

const emit = defineEmits(['update:delete']);

const del = async () => {
    inProgress.value = true;

    try {
        await AccountsService.deleteAccount(data.value.id);
        emit('update:delete');
    } catch (err) {
        errorHandler(err);
    }
    inProgress.value = false;
    toggleDialog(false);
};

/** @param {App.Api.Accounts.Account} account */
const show = (account) => {
    data.value = account;
    toggleDialog(true);
};

defineExpose({
    show,
});

</script>

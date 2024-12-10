<template>
    <v-dialog
        v-model="openDialog"
        persistent
        :width="300"
    >
        <v-card
            v-if="data"
            rounded="lg"
            :loading="inProgress"
            :disabled="inProgress"
        >
            <v-card-title>
                停用/啟用
            </v-card-title>
          
            <v-card-subtitle>
                {{ data.id }} - {{ data.email }}
            </v-card-subtitle>

            <v-card-text>
                <v-switch
                    v-model="enableStatus"
                    inset
                    hide-details
                    :color="enableStatus ? 'success' : undefined"
                />
            </v-card-text>
           
            <v-divider />

            <v-card-actions>
                <v-spacer />
                <v-btn
                    color="success"
                    @click="setEnabled()"
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
import { ref } from 'vue';

import { useI18n } from 'vue-i18n';

import { AccountService } from '@/api/account';
import { useNotifierStore } from '@/store/notifier';
import { Account } from '@/types/account';

const { t } = useI18n();
const notifierStore = useNotifierStore();

const data = ref<Account.Account>(null);
const inProgress = ref(false);
const openDialog = ref(false);

const enableStatus = ref(false);

const toggleDialog = (open: boolean) => {
    openDialog.value = open;
};

/** @param {App.Api.Accounts.Account} account */
const show = (account: Account.Account) => {
    data.value = account;
    enableStatus.value = account.enabled;
    toggleDialog(true);
};

defineExpose({ show });

const emit = defineEmits(['update:enabled']);

const setEnabled = async () => {
    inProgress.value = true;

    try {
        if (enableStatus.value !== data.value.enabled) {
            await AccountService.enable(data.value.id);
            emit('update:enabled');
        }
    } catch (err) {
        notifierStore.error({ content: '啟/停用帳號失敗' });
    }
    inProgress.value = false;
    toggleDialog(false);
};

</script>

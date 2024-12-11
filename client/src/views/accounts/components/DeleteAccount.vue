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
            <v-card-title class="text-error">
                刪除帳號
            </v-card-title>
          
            <v-card-subtitle>
                {{ data.id }} - {{ data.email }}
            </v-card-subtitle>

            <v-card-text>
               確認刪除？
            </v-card-text>
           
            <v-divider />

            <v-card-actions>
                <v-spacer />
                <v-btn
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
import { ref } from 'vue';

import { useI18n } from 'vue-i18n';

import { AccountsService } from '@/api/accounts';
import { useNotifierStore } from '@/store/notifier';
import { Account } from '@/types/account';

const { t } = useI18n();
const notifierStore = useNotifierStore();

const data = ref<Account.Account>(null);
const inProgress = ref(false);
const openDialog = ref(false);

const toggleDialog = (open: boolean) => {
    openDialog.value = open;
};

const show = (account: Account.Account) => {
    data.value = account;
    toggleDialog(true);
};

defineExpose({ show });

const emit = defineEmits(['update:delete']);

const onSubmit = async () => {
    inProgress.value = true;

    try {
        await AccountsService.delete(data.value.id);
        emit('update:delete');
    } catch (err) {
        notifierStore.error({ content: '刪除帳號失敗' });
    }
    inProgress.value = false;
    toggleDialog(false);
};

</script>

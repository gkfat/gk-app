<template>
    <v-dialog
        v-model="openDialog"
        persistent
        :width="500"
    >
        <v-card
            v-if="data"
            rounded="lg"
            :loading="inProgress"
            :disabled="inProgress"
        >
            <v-toolbar color="primary">
                <v-card-title>
                    編輯描述
                </v-card-title>
                <v-btn
                    class="ml-auto"
                    icon="mdi-close"
                    @click="toggleDialog(false)"
                />
            </v-toolbar>

            <v-card-text>
                <p class="mb-3">
                    正在變更 <span class="text-info font-weight-bold">{{ data.permission }}</span> 的描述
                </p>

                <v-text-field
                    v-model="data.description"
                    hide-details
                    autofocus
                    clearable
                    placeholder="請輸入描述"
                />
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

import { PrivilegesService } from '@/api/privileges';
import { useNotifierStore } from '@/store/notifier';
import { Privilege } from '@/types/privilege';

const { t } = useI18n();
const notifierStore = useNotifierStore();

const data = ref<Privilege.Permission>(null);
const inProgress = ref(false);
const openDialog = ref(false);

const toggleDialog = (open: boolean) => {
    openDialog.value = open;
};

const show = (params: Privilege.Permission) => {
    data.value = JSON.parse(JSON.stringify(params));
    toggleDialog(true);
};

defineExpose({ show });

const emit = defineEmits(['update']);

const onSubmit = async () => {
    inProgress.value = true;

    try {
        const params: Privilege.UpdatePermission.Request = {
            permissionId: data.value.id,
            description: data.value.description,
        };
        await PrivilegesService.updatePermission(params);
        emit('update');
        
    } catch (err) {
        notifierStore.error({ content: '編輯描述失敗' });
    }
    inProgress.value = false;
    toggleDialog(false);
};

</script>

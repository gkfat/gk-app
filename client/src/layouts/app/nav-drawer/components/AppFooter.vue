<template>
     <v-list>
        <v-list-item prepend-icon="mdi-logout-variant" :title="t('button.logout')" @click="logout">
          
        </v-list-item>
    </v-list>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import { useAuthStore } from '@/store/auth';
import { useNotifierStore } from '@/store/notifier';

const {t} = useI18n()
const authStore = useAuthStore();
const notifierStore = useNotifierStore();
const router = useRouter();

const logout = async () => {
    await authStore.logout();

    notifierStore.success({
        content: '登出成功',
    });
    
    router.push('/login');
};
</script>
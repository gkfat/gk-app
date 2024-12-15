<template>
    <v-list>
        <v-list-item
            prepend-icon="mdi-logout-variant"
            :title="t('button.logout')"
            @click="authStore.logout"
        />
    </v-list>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

import { useAuthStore } from '@/store/auth';

const { t } = useI18n();
const authStore = useAuthStore();
</script>
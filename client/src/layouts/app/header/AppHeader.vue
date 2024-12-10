<template>
    <v-app-bar
        v-if="isLoggedIn"
        flat
        class="pe-3"
    >
        <AppBreadcrumbs v-if="smAndUp" />
        <v-spacer />

        <AppButtonSetting />
    </v-app-bar>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import { useDisplay } from 'vuetify';

import { useAuthStore } from '@/store/auth';

import AppBreadcrumbs from './components/AppBreadcrumbs.vue';
import AppButtonSetting from './components/AppButtonSetting.vue';

const { smAndUp } = useDisplay();
const authStore = useAuthStore();

const isLoggedIn = computed(() => !!authStore.state?.token);
</script>

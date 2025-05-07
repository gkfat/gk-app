<template>
    <v-app-bar
        v-if="isLoggedIn"
        flat
    >
        <AppBtnMobileDrawer v-if="!smAndUp" />

        <AppBreadcrumbs v-if="smAndUp" />

        <v-spacer />

        <AppBtnProfile />

        <AppBtnSetting />
    </v-app-bar>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import { useDisplay } from 'vuetify';

import { useAuthStore } from '@/store/auth';

import AppBreadcrumbs from './components/AppBreadcrumbs.vue';
import AppBtnMobileDrawer from './components/AppBtnMobileDrawer.vue';
import AppBtnProfile from './components/AppBtnProfile.vue';
import AppBtnSetting from './components/AppBtnSetting.vue';

const authStore = useAuthStore();
const { smAndUp } = useDisplay();

const isLoggedIn = computed(() => !!authStore.state?.token);
</script>

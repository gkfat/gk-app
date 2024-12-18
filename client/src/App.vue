<template>
    <v-app>
        <router-view />
        <Notifier />
        <Overlay />
    </v-app>
</template>

<script lang="ts" setup>
import {
  computed,
  onMounted,
  watch,
} from 'vue';

import { useRouter } from 'vue-router';
import { useTheme } from 'vuetify';

import Notifier from '@/components/notifier/Notifier.vue';

import Overlay from './components/overlay/Overlay.vue';
import { useAppStore } from './store/app';
import { useAuthStore } from './store/auth';
import { useMarketDataStore } from './store/market-data';

const appStore = useAppStore();
const authStore = useAuthStore();
const marketDataStore = useMarketDataStore();

const router = useRouter();
const theme = useTheme();
const currentTheme = computed(() => (appStore.storage.darkTheme ? 'dark' : 'light'));

const setTheme = (themeValue: 'dark'|'light') => {
    document.documentElement.setAttribute(
        'data-color-theme',
        themeValue,
    );

    theme.global.name.value = themeValue;
};

watch(
    () => currentTheme.value,
    () => setTheme(currentTheme.value),
);

const setEnvironmentVaraibles = async () => {
    appStore.state.environmentVariables = {
        appTitle: import.meta.env.VITE_APP_TITLE ?? 'GkApp', 
        apiUrl: import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:3000/api/v1',
    };
};

const checkIsLoggedIn = () => {
    if (authStore.state.token) {
        // 更新股票資訊
        marketDataStore.refreshTickers();
    } else {
        router.push('/login');
    }
};

onMounted(async () => {
    setTheme(currentTheme.value);
    await setEnvironmentVaraibles();
    checkIsLoggedIn();
});

watch(
    () => authStore.state.token,
    () => {
        checkIsLoggedIn();
    },
);
</script>

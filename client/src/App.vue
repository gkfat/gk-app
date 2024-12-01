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

import { useTheme } from 'vuetify';

import Notifier from '@/components/notifier/Notifier.vue';

import Overlay from './components/overlay/Overlay.vue';
import { useAppStore } from './store/app';

const appStore = useAppStore();
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
        appTitle: import.meta.env.VITE_APP_TITLE ?? 'Got Todo',
    };
};

onMounted(async () => {
    setTheme(currentTheme.value);
    await setEnvironmentVaraibles();
});
</script>

import { ref } from 'vue';

import { defineStore } from 'pinia';

import { useLocalStorage } from '@vueuse/core';

interface EnvironmentVariables {
    appTitle: string;
}

function createDefaultState() {
    return {
        darkTheme: false,
    };
}

export const useAppStore = defineStore('app', () => {
    const storage = useLocalStorage('got-todo-appstore', createDefaultState(), { mergeDefaults: true });

    const state = ref({
        drawer: false,
        settingDrawer: false,
        overlay: false,
        environmentVariables: {
            appTitle: '',
        } as EnvironmentVariables,
    });

    const toggleDrawer = () => {
        state.value.drawer = !state.value.drawer;
    };

    const toggleSettingDrawer = () => {
        state.value.settingDrawer = !state.value.settingDrawer;
    };

    const toggleOverlay = (isOpen?: boolean) => {
        state.value.overlay = isOpen ?? !state.value.overlay;
    };

    const switchTheme = (isDark: boolean) => {
        storage.value.darkTheme = isDark;
    };

    return {
        storage,
        state,
        toggleDrawer,
        toggleOverlay,
        toggleSettingDrawer,
        switchTheme,
    };
});

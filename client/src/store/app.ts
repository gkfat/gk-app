import { ref } from 'vue';

import { defineStore } from 'pinia';

import { useLocalStorage } from '@vueuse/core';

interface EnvironmentVariables {
    appTitle: string;
    apiUrl: string;
}

function createDefaultState() {
    return { darkTheme: false };
}

export const useAppStore = defineStore('app', () => {
    const storage = useLocalStorage('gkapp-appstore', createDefaultState(), { mergeDefaults: true });

    const state = ref({
        drawer: true,
        settingDrawer: false,
        overlay: false,
        environmentVariables: {
            appTitle: '', apiUrl: '', 
        } as EnvironmentVariables,
    });

    const toggleDrawer = (target: boolean = !state.value.drawer) => {
        state.value.drawer = target;
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

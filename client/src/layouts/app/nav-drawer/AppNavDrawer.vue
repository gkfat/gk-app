<template>
    <v-navigation-drawer
        v-if="isLoggedIn"
        v-model="appStore.state.drawer"
        disable-resize-watcher
        theme="dark"
    >
        <AppAvatar />

        <v-divider />
        
        <AppDrawerItem />

        <template #append>
            <v-divider />
    
            <AppFooter />
        </template>
    </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import { useAppStore } from '@/store/app';
import { useAuthStore } from '@/store/auth';

import AppAvatar from './components/AppAvatar.vue';
import AppDrawerItem from './components/AppDrawerItem.vue';
import AppFooter from './components/AppFooter.vue';

const appStore = useAppStore();
const authStore = useAuthStore();

const isLoggedIn = computed(() => !!authStore.state?.token);
const account = computed(() => authStore.state?.account);

const avatarAlternative = computed(() => {
    if (account.value?.name) {
        return account.value.name[0].toUpperCase();
    }

    return '';
});
</script>

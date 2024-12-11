<template>
    <v-navigation-drawer
        v-if="isLoggedIn"
        v-model="appStore.state.drawer"
        disable-resize-watcher
        expand-on-hover
        permanent
        theme="dark"
        :rail="rail"
    >
        <AppAvatar>
            <template #append>
                <v-btn
                    :icon="rail ? 'mdi-pin-outline' : 'mdi-pin-off-outline'"
                    variant="text"
                    @click.stop="rail = !rail"
                />
            </template>    
        </AppAvatar>

        <v-divider />
        
        <AppDrawerItem />

        <template #append>
            <v-divider />
    
            <AppFooter />
        </template>
    </v-navigation-drawer>
</template>

<script lang="ts" setup>
import {
  computed,
  ref,
} from 'vue';

import { useAppStore } from '@/store/app';
import { useAuthStore } from '@/store/auth';

import AppAvatar from './components/AppAvatar.vue';
import AppDrawerItem from './components/AppDrawerItem.vue';
import AppFooter from './components/AppFooter.vue';

const appStore = useAppStore();
const authStore = useAuthStore();

const rail = ref(true);

const isLoggedIn = computed(() => !!authStore.state?.token);
</script>

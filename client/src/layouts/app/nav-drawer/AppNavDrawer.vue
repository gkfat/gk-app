<template>
    <!-- desktop -->
    <v-navigation-drawer
        v-if="isLoggedIn && smAndUp"
        permanent
        :rail="isRail"
    >
        <AppBtnRail v-model="isRail" />
    
        <v-divider />
        
        <AppDrawerItem />

        <template #append>
            <v-divider />
    
            <AppFooter />
        </template>
    </v-navigation-drawer>

    <!-- mobile -->
    <v-dialog
        v-if="isLoggedIn && !smAndUp"
        v-model="appStore.state.drawer"
        fullscreen
        transition="dialog-bottom-transition"
    >
        <v-card class="full-height">
            <v-card-text class="px-1">
                <AppDrawerItem />
                
                <v-divider />
            
                <AppFooter />
            </v-card-text>

            <v-divider />

            <v-card-actions>
                <v-btn
                    class="mx-auto"
                    block
                    @click="appStore.toggleDrawer(false)"
                >
                    <v-icon
                        size="x-large"
                        icon="mdi-chevron-down"
                    />
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts" setup>
import {
    computed,
    ref,
    watch,
} from 'vue';

import { useRoute } from 'vue-router';
import { useDisplay } from 'vuetify';

import { useAppStore } from '@/store/app';
import { useAuthStore } from '@/store/auth';

import AppBtnRail from './components/AppBtnRail.vue';
import AppDrawerItem from './components/AppDrawerItem.vue';
import AppFooter from './components/AppFooter.vue';

const appStore = useAppStore();
const authStore = useAuthStore();
const route = useRoute();
const { smAndUp } = useDisplay();

const isLoggedIn = computed(() => !!authStore.state?.token);
const isRail = ref(false);

watch(
    () => route.fullPath,
    () => {
        if (!smAndUp.value) {
            appStore.toggleDrawer(false);
        }
    },
);
</script>

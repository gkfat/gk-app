<template>
    <v-navigation-drawer
        v-model="appStore.state.settingDrawer"
        temporary
        location="right"
    >
        <v-toolbar>
            <v-toolbar-title class="text-h6 font-weight-medium text--primary">
                設定
            </v-toolbar-title>
            <v-btn
                icon="mdi-close"
                @click="appStore.toggleSettingDrawer"
            />
        </v-toolbar>

        <v-divider />

        <div>
            <ThemeSelect />

            <v-divider />
        </div>
    </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { useAppStore } from '@/store/app';

import ThemeSelect from './components/ThemeSelect.vue';

const appStore = useAppStore();
</script>

<style lang="scss" scoped>
.theme--dark.v-application {
    .v-navigation-drawer{
        background-color: rgb(39, 39, 39);
        border-color: rgb(39, 39, 39);
    }
}
</style>

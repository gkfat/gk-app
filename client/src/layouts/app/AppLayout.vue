<template>
    <div class="fill-height">
        <AppNavDrawer v-if="smAndUp" />
        <AppSettingDrawer />
        <AppHeader />
        <AppContent />
    </div>
</template>

<script lang="ts" setup>
import { useDisplay } from 'vuetify';

import AppNavDrawer from '@/layouts/app/nav-drawer/AppNavDrawer.vue';

import AppContent from './content/AppContent.vue';
import AppHeader from './header/AppHeader.vue';
import AppSettingDrawer from './setting-drawer/AppSettingDrawer.vue';

const { smAndUp } = useDisplay();
</script>

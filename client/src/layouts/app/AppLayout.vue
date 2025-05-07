<template>
    <div class="fill-height bg-background">
        <AppNavDrawer />
        <AppSettingDrawer />
        <AppHeader />
        <AppContent />
    </div>
</template>

<script lang="ts" setup>
import AppNavDrawer from '@/layouts/app/nav-drawer/AppNavDrawer.vue';

import AppContent from './content/AppContent.vue';
import AppHeader from './header/AppHeader.vue';
import AppSettingDrawer from './setting-drawer/AppSettingDrawer.vue';
</script>

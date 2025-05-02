<template>
    <v-btn
        icon="mdi-menu"
        color="darkgrey"
        flat
        @click="appStore.toggleDrawer"
    />
</template>

<script lang="ts" setup>
import { useAppStore } from '@/store/app';

const appStore = useAppStore();
</script>

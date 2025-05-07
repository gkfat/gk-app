<template>
    <v-btn
        icon="mdi-cog"
        color="primary"
        flat
        @click="appStore.toggleSettingDrawer"
    />
</template>

<script lang="ts" setup>
import { useAppStore } from '@/store/app';

const appStore = useAppStore();

</script>

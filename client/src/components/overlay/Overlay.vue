<template>
    <v-overlay
        v-model="isOpen"
        class="align-center justify-center"
    >
        <v-progress-circular
            color="primary"
            size="64"
            indeterminate
        />
    </v-overlay>
</template>
<script lang="ts" setup>
import { computed } from 'vue';

import { useAppStore } from '@/store/app';

const appStore = useAppStore();

const isOpen = computed(() => appStore.state.overlay);
</script>

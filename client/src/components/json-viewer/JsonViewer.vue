<template>
    <json-viewer
        :value="value"
        :expand-depth="expandDepth"
        :copyable="copyable"
        :theme="currentTheme"
    />
</template>
<script setup>
import 'vue3-json-viewer/dist/index.css';

import { computed } from 'vue';

import { JsonViewer } from 'vue3-json-viewer';

import { useAppStore } from '@/store/app';

const appStore = useAppStore();
const currentTheme = computed(() => (appStore.storage.darkTheme ? 'dark' : 'light'));

defineProps({
    value: {
        type: Object,
        required: true,
    },
    expandDepth: {
        type: Number,
        required: true,
    },
    copyable: {
        type: Boolean,
        required: true,
    },
});

</script>

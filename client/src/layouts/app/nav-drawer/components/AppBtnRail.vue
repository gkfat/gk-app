<template>
    <v-list nav>
        <v-list-item
            class="text-right"
            @click="model = !model"
        >
            <v-icon :icon="model ? 'mdi-chevron-right' : 'mdi-chevron-left'" />
        </v-list-item>
    </v-list>
</template>

<script lang="ts" setup>
const model = defineModel('modelValue', {
    type: Boolean,
    default: () => false,
});
</script>

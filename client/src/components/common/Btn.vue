<template>
    <v-btn
        :color="color"
        :variant="variant"
        :rounded="icon ? undefined : 'lg'"
        :disabled="disabled"
        :icon="icon"
        :append-icon="appendIcon"
        @click="execFunc ? execFunc() : null"
    >
        <template #default>
            <v-icon
                v-if="icon"
                :icon="icon"
            />

            <span v-else>
                {{ title }}
            </span>
        </template>
    </v-btn>
</template>
<script lang="ts" setup>
const {
    title,
    icon,
    color,
    variant,
    appendIcon,
    disabled,
    execFunc,
} = withDefaults(defineProps<{
    title?: string;
    icon?: string;
    color?: string;
    variant?: 'flat' | 'text' | 'elevated' | 'tonal' | 'outlined' | 'plain';
    appendIcon?: string;
    disabled?: boolean;
    execFunc?:() => void;
}>(), {
    color: 'default',
    variant: 'elevated',
});
</script>

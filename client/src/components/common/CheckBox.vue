<template>
    <v-btn
        :text="parentProps.title"
        variant="outlined"
        :disabled="parentProps.disabled"
        rounded="lg"
        class="py-7"
        :class="{ 'bg-lightgreen': isChecked }"
        block
        @click="toggleCheck"
    >
        <template #prepend>
            <v-icon
                v-if="isChecked"
                color="primary"
                icon="mdi-checkbox-marked"
            />
            <v-icon
                v-if="!isChecked"
                color="grey"
                icon="mdi-checkbox-blank"
            />
        </template>
    </v-btn>
</template>
<script lang="ts" setup>
import {
    ref,
    watch,
} from 'vue';

const parentProps = defineProps<{
    modelValue: boolean;
    title: string;
    disabled?: boolean;
}>();

const isChecked = ref(parentProps.modelValue);

watch(parentProps, () => {
    isChecked.value = parentProps.modelValue;
});

const emit = defineEmits(['update:modelValue']);

const toggleCheck = () => {
    isChecked.value = !isChecked.value;
    emit('update:modelValue', isChecked.value);
};
</script>

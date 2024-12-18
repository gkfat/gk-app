<template>
    <v-card
        :class="isFading ? 'fading rounded-lg elevation-8' : 'rounded-lg elevation-8'"
        width="100%"
        max-width="450"
        :color="color"
    >
        <v-card-actions class="pl-4 pr-1">
            <v-icon
                class="mr-5"
                :icon="statusIcon"
            />
            <span
                class="grey--text text-lighten-3 text-body-1"
                v-text="content"
            />
            <v-spacer />
            <v-btn
                variant="text"
                icon="mdi-close"
                @click="dismissNotify(pKey)"
            />
        </v-card-actions>
    </v-card>
</template>

<script lang="ts" setup>
import {
    computed,
    onMounted,
    ref,
} from 'vue';

import { useNotifierStore } from '@/store/notifier';

const notifierStore = useNotifierStore();

const isFading = ref(false);

const props = withDefaults(defineProps<{
    pKey: string;
    color?: string;
    content?: string;
    timeout?: number
}>(), {
    color: 'primary',
    content: '',
    timeout: -1,
});

const statusIcon = computed(() => {
    let icon = 'mdi-information-outline';
    switch (props.color) {
    case 'primary': icon = 'mdi-information-outline'; break;
    case 'warn': icon = 'mdi-alert-circle-outline'; break;
    case 'error': icon = 'mdi-minus-circle-outline'; break;
    case 'success': icon = 'mdi-check-circle-outline'; break;
    default: icon = 'mdi-information-outline'; break;
    }
    return icon;
});

const dismissNotify = (id: string) => {
    isFading.value = true;
    setTimeout(() => notifierStore.remove(id), 300);
};

onMounted(() => {
    if (props.timeout > 0) {
        setTimeout(() => dismissNotify(props.pKey), props.timeout);
    }
});
</script>

<style lang="scss" scoped>
.fading {
    animation-name: Fade;
    animation-duration: 0.5s;
}

@keyframes Fade {
    from {
        opacity: 1;
        transform: translateX(0);
    }
    to {
        opacity: 0;
        transform: translateX(120%);
    }
}
</style>

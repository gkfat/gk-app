<template>
    <div
        :class="{
            'mb-16': showGoToTop,
            'mb-md-0': showGoToTop,
        }"
    >
        <v-progress-linear
            :active="loading"
            indeterminate
            fixed
        />

        <v-container
            class="pt-0"
            fluid
        >
            <v-row class="ma-0">
                <v-col
                    cols="12"
                    class="pa-0"
                >
                    <v-card
                        :disabled="loading"
                        flat
                        color="transparent"
                    >
                        <!-- page content goes here -->
                        <slot />
                    </v-card>
                </v-col>
            </v-row>
        </v-container>

        <Btn
            v-if="showGoToTop"
            v-show="passScrollToTopThreshold"
            v-scroll="onScroll"
            :icon="'mdi-chevron-up'"
            :exec-func="() => goTo(0)"
            class="ma-6"
            position="fixed"
            location="right bottom"
        />
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import Btn from '@/components/common/Btn.vue';

withDefaults(defineProps<{
    loading?: boolean;
    showGoToTop?: boolean;
}>(), {
    loading: false,
    showGoToTop: true,
});

const goTo = (y: number) => {
    window.scrollTo({
        top: y,
        behavior: 'smooth',
    });
};

const passScrollToTopThreshold = ref(false);

const onScroll = (e: any) => {
    if (typeof window === 'undefined') return;
    const top = window.scrollY || e.target.scrollTop || 0;
    const threshold = Math.ceil(window.innerHeight * 0.3);
    passScrollToTopThreshold.value = top >= threshold;
};
</script>

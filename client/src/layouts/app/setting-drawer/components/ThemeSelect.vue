<template>
    <v-card
        flat
        class="bg-transparent"
    >
        <v-card-title class="pb-0">
            主題設定
        </v-card-title>

        <v-item-group
            v-model="themeSelect"
            mandatory
            selected-class="info"
        >
            <v-container>
                <v-row class="ma-0 ga-1 flex-nowrap align-cetner">
                    <v-col
                        v-for="(item, i) of themes"
                        :key="i"
                        class="pa-0"
                    >
                        <v-item
                            v-slot="{isSelected, toggle}"
                            :value="item.value"
                        >
                            <v-card
                                :color="isSelected ? 'info': 'grey'"
                                class="d-flex align-center justify-center ga-2 py-3 px-4"
                                flat
                                rounded
                                @click="toggle"
                            >
                                <span>{{ item.title }}</span>
                                <v-icon>{{ item.icon }}</v-icon>
                            </v-card>
                        </v-item>
                    </v-col>
                </v-row>
            </v-container>
        </v-item-group>
    </v-card>
</template>

<script lang="ts" setup>
import {
    computed,
    onMounted,
    ref,
    watch,
} from 'vue';

import { useAppStore } from '@/store/app';

const appStore = useAppStore();
const isDark = computed(() => appStore.storage.darkTheme);

const themeSelect = ref(false);

watch(
    () => themeSelect.value,
    () => {
        appStore.switchTheme(themeSelect.value);
    },
);

const themes = [
    {
        title: '淺色', value: false, icon: 'mdi-white-balance-sunny', 
    }, {
        title: '深色', value: true, icon: 'mdi-moon-waxing-crescent', 
    },
];

onMounted(() => {
    themeSelect.value = isDark.value;
});
</script>

<style lang="scss" scoped>
</style>

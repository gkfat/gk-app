<template>
    <v-main
        class="fill-height"
        :class="{'bg-grey': isDarkBackgroud}"
    >
        <keep-alive
            v-if="route.meta?.keepAlive"
            :max="15"
        >
            <router-view :key="route.fullPath" />
        </keep-alive>
        <router-view
            v-else
            :key="route.fullPath"
        />
    </v-main>
</template>
<script lang="ts" setup>
import { computed } from 'vue';

import { useRoute } from 'vue-router';

const route = useRoute();
const isDarkBackgroud = computed(() => ['dashboard', 'login'].some((path) => route.path.includes(path)));
</script>

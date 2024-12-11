<template>
    <v-row class="ma-0 align-center">
        <v-col
            cols="12"
            sm="auto"
            class="pa-0"
        >
            <v-card-title class="font-weight-bold">
                {{ title }}
                <em v-if="dataCount">{{ dataCount }}</em>
            </v-card-title>

            <v-card-subtitle v-if="subtitle">
                {{ subtitle }}
            </v-card-subtitle>
        </v-col>

        <!-- 控制列 -->
        <v-col
            cols="auto"
            class="px-0 pe-3 ml-auto"
        >
            <slot name="controlPanel" />
        </v-col>
    </v-row>
</template>

<script lang="ts" setup>
const {
    title,
    subtitle,
    dataCount,
} = defineProps<{
    title: string;
    subtitle?: string;
    dataCount?: number;
}>();
</script>
<style lang="css" scoped>

</style>

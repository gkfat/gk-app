<template>
    <v-row class="ga-1 ma-0">
        <v-col
            class="pa-0"
            cols="12"
        >
            <p class="d-flex align-center ga-1">
                <v-icon
                    color="info"
                    icon="mdi-label"
                />
                <span class="text-info font-weight-bold">
                    {{ props.title }}
                </span>
            </p>
        </v-col>
        <v-col
            v-if="props.description"
            class="bg-secondary rounded text-caption pa-0 px-2 mb-2"
            cols="12"
        >
            ＊{{ props.description }}
        </v-col>
    </v-row>
</template>
<script lang="ts" setup>
const props = defineProps<{
    title: string;
    description?: string;
}>();
</script>

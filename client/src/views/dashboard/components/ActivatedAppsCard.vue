<template>
    <v-card
        elevation="3"
        rounded="lg"
    >
        <v-card-title>
            已啟用的服務
        </v-card-title>
        <v-divider />
        <v-card-text>
            <v-row class="ma-0 flex-wrap">
                <v-col
                    v-for="(item, i) in applications"
                    :key="i"
                    cols="12"
                >
                    <v-switch
                        :model-value="item.activated"
                        readonly
                        hide-details
                        density="compact"
                        :color="item.activated ? 'success' : ''"
                    >
                        <template #label>
                            <p class="pl-3 text-h6">
                                {{ t('applications.' + item.key) }}
                            </p>
                        </template>
                    </v-switch>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const applications = ref([
    {
        key: 'portfolio', activated: true, 
    }, {
        key: 'popcron', activated: false, 
    },
]);
</script>
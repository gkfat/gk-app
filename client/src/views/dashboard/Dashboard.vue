<template>
    <PageContent
        show-go-to-top
        :loading="inProgress"
    >
        <v-card elevation="2">
            <v-card-title>
                {{ t('dashboard.title') }}
            </v-card-title>
        </v-card>

        <!-- <v-row class="pb-10">
            <v-col cols="auto">
                <ActivatedAppsCard />
            </v-col>
        </v-row> -->
    </PageContent>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

import { useI18n } from 'vue-i18n';

import PageContent from '@/layouts/panel/PageContent.vue';

// import ActivatedAppsCard from './components/ActivatedAppsCard.vue';

const inProgress = ref(false);

const { t } = useI18n();

</script>

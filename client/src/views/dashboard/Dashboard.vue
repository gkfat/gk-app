<template>
    <PageContent
        show-go-to-top
        :loading="inProgress"
    >
        <PageHeader
            :title="t('dashboard.title')"
        />
    </PageContent>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

import { useI18n } from 'vue-i18n';

import PageContent from '@/layouts/panel/PageContent.vue';
import PageHeader from '@/layouts/panel/PageHeader.vue';
import { timeFormat } from '@/utils/time';

const inProgress = ref(false);

const { t } = useI18n();
</script>

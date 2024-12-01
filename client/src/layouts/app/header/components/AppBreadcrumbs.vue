<template>
    <v-breadcrumbs
        :items="items"
        divider="/"
        color="primary"
    />
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

const { t } = useI18n();
const route = useRoute();

const items = computed(() => {
    const rs = route.matched
        .filter((record) => !record.meta.hidden && Boolean(record.meta.title))
        .map((record, idx, records) => {
            const isLast = idx === records.length - 1;

            return {
                exact: true,
                to: isLast ? route.fullPath : record.path,
                title: record.meta.title ? t(record.meta.title) : '',
            };
        });

    if (!rs.length) {
        return [];
    }

    // add dashboard as root
    if (rs[0].to !== '/dashboard') {
        rs.unshift({
            exact: true,
            to: '/dashboard',
            title: t('nav.dashboard'),
        });
    }

    return rs;
});

</script>

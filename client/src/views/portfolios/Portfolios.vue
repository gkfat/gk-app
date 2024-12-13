<template>
    <PageContent
        :loading="inProgress"
        show-go-to-top
    >
        <PageHeader
            :title="'投資組合'"
        >
            <template #controlPanel>
                <v-row class="align-center">
                    <v-btn
                        color="info"
                        class="mr-3"
                        append-icon="mdi-reload"
                        @click="listPortfolios"
                    >
                        {{ t('button.refresh') }}
                    </v-btn>
                </v-row>
            </template>
        </PageHeader>

        <v-spacer class="mb-3" />

        <v-item-group
            v-model="currentPortfolio"
            mandatory
        >
            <v-row class="ga-3">
                <v-col
                    v-for="(item, i) in portfolios"
                    :key="i"
                    cols="auto"
                >
                    <v-item
                        v-slot="{isSelected, toggle}"
                        :value="item"
                    >
                        <v-card
                            :color="isSelected ? 'primary': ''"
                            :title="`${item.title}`"
                            :subtitle="`${item.currency} - ${item.create_date}`"
                            @click="toggle"
                        />
                    </v-item>
                </v-col>
            </v-row>
        </v-item-group>

        <v-divider class="my-5" />
        
        <PortfolioCard :portfolio="currentPortfolio" />
    </PageContent>
</template>

<script lang="ts" setup>
import {
  onMounted,
  ref,
} from 'vue';

import { useI18n } from 'vue-i18n';

import { PortfoliosService } from '@/api/portfolios';
import { Permissions } from '@/enums/permissions';
import PageContent from '@/layouts/panel/PageContent.vue';
import PageHeader from '@/layouts/panel/PageHeader.vue';
import { useAuthStore } from '@/store/auth';
import { useNotifierStore } from '@/store/notifier';
import { Portfolio } from '@/types/portfolio';

import PortfolioCard from './components/PortfolioCard.vue';

const notifierStore = useNotifierStore();
const authStore = useAuthStore();
const { t } = useI18n();

/**
 * 操作權限
 */
const havePermissionTo = ref({
    add: authStore.havePermission(Permissions.portfolio.portfolios.add),
    update: authStore.havePermission(Permissions.portfolio.portfolios.update),
    delete: authStore.havePermission(Permissions.portfolio.portfolios.delete),
});

const inProgress = ref(false);
const portfolios = ref<Portfolio.Portfolio[]>([]);

const currentPortfolio = ref<Portfolio.Portfolio>();

const listPortfolios = async () => {
    inProgress.value = true;
    try {
        portfolios.value = await PortfoliosService.list();
        currentPortfolio.value = portfolios.value[0];
    } catch {
        notifierStore.error({ content: '取得投資組合失敗' });
    }
    inProgress.value = false;
};

onMounted(async () => {
    await listPortfolios();
});
</script>

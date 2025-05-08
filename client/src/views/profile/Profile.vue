<template>
    <PageContent
        :loading="inProgress"
        show-go-to-top
    >
        <v-card elevation="2">
            <v-card-title>
                {{ t('profile.title') }}
            </v-card-title>
        </v-card>

        <v-spacer class="mb-3" />

        <v-row class="ga-3">
            <v-col
                cols="12"
            >
                <AccountInfo :account="account" />
            </v-col>
        </v-row>
    </PageContent>
</template>

<script lang="ts" setup>
import {
    computed,
    ref,
} from 'vue';

import { useI18n } from 'vue-i18n';

import PageContent from '@/layouts/panel/PageContent.vue';
import { useAuthStore } from '@/store/auth';
import { humanReadable } from '@/utils/time';

import AccountInfo from './components/AccountInfo.vue';

const { t } = useI18n();
const authStore = useAuthStore();
const inProgress = ref(false);

const account = computed(() => authStore.state?.account);

const getLastLoggedIn = computed(() => humanReadable(account.value.last_login_at, true));
</script>

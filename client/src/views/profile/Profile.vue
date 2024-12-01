<template>
    <PageContent
        :loading="inProgress"
        show-go-to-top
    >
        <PageHeader
            :title="t('profile.title')"
        />

        <v-spacer />

        <v-container fluid>
            <v-row
                v-if="user"
                class="align-stretch"
            >
                <template v-if="isGuest">
                    <v-col
                        cols="12"
                        sm="auto"
                    >
                        <ShareCard color="warn">
                            <template #default>
                                <v-card-title class="d-flex align-center">
                                    <v-icon
                                        icon="mdi-information-outline"
                                        class="me-3"
                                    />
                                    請變更預設密碼
                                    <UpdateProfile
                                        :user="user"
                                        @update:profile="onProfileUpdate"
                                    />
                                </v-card-title>
                                <v-card-subtitle>
                                    變更密碼以啟用完整後台功能。
                                </v-card-subtitle>
                            </template>
                        </ShareCard>
                    </v-col>
                </template>

                <template v-else>
                    <v-col
                        cols="12"
                        sm="auto"
                    >
                        <ShareCard>
                            <template #default>
                                <v-card-title>
                                    <v-row class="ma-0 align-center ga-1">
                                        <v-col
                                            cols="auto"
                                            class="pa-0 text-h6"
                                        >
                                            歡迎回來，
                                        </v-col>
                                        <v-col
                                            cols="auto"
                                            class="pa-0 font-weight-bold text-h5"
                                        >
                                            {{ user.nick_name }}
                                        </v-col>
                                        <v-col
                                            cols="auto"
                                            class="pa-0 ml-auto"
                                        >
                                            <UpdateProfile
                                                :user="account"
                                            />
                                        </v-col>
                                    </v-row>
                                </v-card-title>
                                <v-card-subtitle>
                                    上次登入：{{ getLastLoginTime }}
                                </v-card-subtitle>
                                <v-card-text>
                                    <v-row class="ma-0 align-center">
                                        <v-col
                                            cols="6"
                                            class="pa-1"
                                        >
                                            Id
                                        </v-col>
                                        <v-col
                                            cols="6"
                                            class="pa-1 text-info font-weight-bold"
                                        >
                                            {{ account.id }}
                                        </v-col>
                                        <v-col
                                            cols="6"
                                            class="pa-1"
                                        >
                                            Account
                                        </v-col>
                                        <v-col
                                            cols="6"
                                            class="pa-1 text-info font-weight-bold"
                                        >
                                            {{ account.name }}
                                        </v-col>
                                    </v-row>
                                </v-card-text>
                            </template>
                        </ShareCard>
                    </v-col>

                    <v-col
                        cols="12"
                        sm="auto"
                    >
                        <ShareCard>
                            <template #default>
                                <v-card-title>
                                    帳號角色
                                </v-card-title>
                                <v-card-text>
                                    <v-chip
                                        v-for="role in account.roles"
                                        :key="role"
                                        class="ma-1"
                                    >
                                        {{ t(`role.${role}`) }}
                                    </v-chip>
                                </v-card-text>
                            </template>
                        </ShareCard>
                    </v-col>
                </template>
            </v-row>
        </v-container>
    </PageContent>
</template>

<script lang="ts" setup>
import {
    computed,
    onMounted,
    ref,
} from 'vue';

import { useI18n } from 'vue-i18n';

import PageContent from '@/layouts/panel/PageContent.vue';
import PageHeader from '@/layouts/panel/PageHeader.vue';
import { useAuthStore } from '@/store/auth';
import { useNotifierStore } from '@/store/notifier';
import { permissionChecker } from '@/utils/permission';
import {
    createDate,
    timeFormat,
    toMiliSeconds,
} from '@/utils/time';

import ShareCard from './components/ShareCard.vue';
import UpdateProfile from './components/UpdateProfile.vue';

const { t } = useI18n();
const authStore = useAuthStore();
const notifierStore = useNotifierStore();
const inProgress = ref(false);

const account = computed(() => authStore.state?.account);
const isGuest = computed(() => permissionChecker.isGuest());
const getLastLoginTime = computed(() => {
    if (account.value) {
        return timeFormat(createDate(toMiliSeconds(account.value.last_login_time)));
    }

    return 'N/A';
});

onMounted(() => {
    if (isGuest.value) {
        notifierStore.warn({
            content: t('profile.message_change_password_reminder'),
        });
    }
});
</script>

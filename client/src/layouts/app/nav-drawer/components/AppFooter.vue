<template>
    <v-list nav>
        <v-list-item
            :title="account.name"
            :subtitle="account.email"
        >
            <template #prepend>
                <v-avatar
                    color="primary"
                    rounded="lg"
                >
                    <v-img
                        v-if="account.avatar"
                        alt="avatar"
                        :src="account.avatar"
                    />

                    <span
                        v-else
                        class="font-weight-bold"
                    >
                        {{ avatarAlternative }}
                    </span>
                </v-avatar>
            </template>

            <template #append>
                <slot name="append" />
            </template>
        </v-list-item>

        <v-divider class="my-1" />
        
        <v-list-item
            prepend-icon="mdi-logout-variant"
            :title="t('button.logout')"
            @click="authStore.logout"
        />
    </v-list>
</template>
<script lang="ts" setup>
import { computed } from 'vue';

import { useI18n } from 'vue-i18n';

import { useAuthStore } from '@/store/auth';

const { t } = useI18n();

const authStore = useAuthStore();

const account = computed(() => authStore.state?.account);

const avatarAlternative = computed(() => {
    if (account.value?.name) {
        return account.value.name[0].toUpperCase();
    }

    return '';
});
</script>
<template>
    <v-list>
        <v-list-item
            :title="account.name"
        >
            <template #prepend>
                <v-avatar
                    color="secondary"
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
    </v-list>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import { useAuthStore } from '@/store/auth';

const authStore = useAuthStore();

const account = computed(() => authStore.state?.account);

const avatarAlternative = computed(() => {
    if (account.value?.name) {
        return account.value.name[0].toUpperCase();
    }

    return '';
});
</script>

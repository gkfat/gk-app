<template>
     <v-list>
        <v-list-item :title="account.name">
            <template #prepend>
                <v-avatar
                    color="secondary"
                    :size="40"
                >
                    <span class="font-weight-bold">
                        {{ avatarAlternative }}
                    </span>
                </v-avatar>
            </template>
        </v-list-item>
    </v-list>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import { useAuthStore } from '@/store/auth';

const authStore = useAuthStore();

const isLoggedIn = computed(() => !!authStore.state?.token);
const account = computed(() => authStore.state?.account);

const avatarAlternative = computed(() => {
    if (account.value?.name) {
        return account.value.name[0].toUpperCase();
    }

    return '';
});
</script>

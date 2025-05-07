<template>
    <v-btn
        icon="mdi-account"
        color="primary"
        flat
        @click="toProfile"
    />
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const toProfile = () => {
    router.push('/profile');
};
</script>

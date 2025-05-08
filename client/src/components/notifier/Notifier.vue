<template>
    <transition-group
        tag="div"
        class="notifier-wrapper d-flex flex-column flex-sm-column-reverse align-end pa-4"
    >
        <template
            v-for="item in notifierStore.list"
            :key="item.id"
        >
            <NotificationCard
                class="notification mb-4 mt-sm-0 mx-sm-2 mx-auto"
                :p-key="item.id"
                :content="item.content"
                :timeout="item.timeout"
                :color="item.color"
            />
        </template>
    </transition-group>
</template>

<script lang="ts" setup>
import { useNotifierStore } from '@/store/notifier';

import NotificationCard from './components/NotificationCard.vue';

const notifierStore = useNotifierStore();

</script>

<style lang="scss" scoped>
.notifier-wrapper {
    position: fixed;
    width: 100%;
    height: 100vh;
    padding-bottom: 30px;
    padding-top: 30px;
    z-index: 9999;
    pointer-events: none;

    .notification {
        pointer-events: auto;
        transition: all 0.5s;
    }
}
</style>

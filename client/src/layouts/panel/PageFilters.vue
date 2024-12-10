<template>
    <v-card
        flat
        rounded="lg"
        class="bg-transparent px-2 pb-2"
    >
        <!-- 篩選器 -->
        <v-expansion-panels
            v-model="isOpen"
            rounded="lg"
            variant="accordion"
        >
            <v-expansion-panel
                value="true"
                color="secondary"
                height="24"
                rounded="lg"
            >
                <v-expansion-panel-title>
                    <v-row class="align-center">
                        <v-col
                            cols="auto"
                            class="d-flex align-center"
                            style="font-size: 1rem;"
                        >
                            <v-icon
                                icon="mdi-filter-variant"
                                class="me-2"
                                size="18"
                            />
                            篩選
                        </v-col>
                    </v-row>
                </v-expansion-panel-title>

                <v-expansion-panel-text>
                    <slot name="filterForm" />

                    <v-row class="ma-0">
                        <v-col
                            cols="auto"
                            class="ml-auto pa-0"
                        >
                            <Btn
                                :color="'error'"
                                class="me-3"
                                :append-icon="'mdi-close'"
                                :exec-func="onReset"
                                :title="t('button.clear')"
                            />

                            <Btn
                                :color="'info'"
                                :append-icon="'mdi-reload'"
                                :exec-func="onSubmit"
                                :title="t('button.search')"
                            />
                        </v-col>
                    </v-row>
                </v-expansion-panel-text>
            </v-expansion-panel>
        </v-expansion-panels>

        <!-- 篩選條件清單 -->
        <v-card-actions
            v-if="filterConditions && filterConditions.length"
            class="px-0"
        >
            <v-row class="ma-0 ga-1">
                <v-col
                    v-for="(condition) in filterConditions"
                    :key="condition.key"
                    cols="auto"
                    class="pa-0"
                >
                    <v-chip
                        color="darkinfo"
                        class="text-wrap py-1"
                        variant="flat"
                        :closable="condition.closable"
                        :style="{
                            height: 'auto',
                        }"
                        @click:close="onConditionUpdate(condition.key)"
                    >
                        <span
                            class="me-1"
                            :style="{
                                fontSize: '0.8rem'
                            }"
                        >{{ condition.title }}：</span>
                        <span
                            class="font-weight-bold"
                            :style="{
                                fontSize: '0.8rem'
                            }"
                        >{{ condition.value }}</span>
                    </v-chip>
                </v-col>
            </v-row>
        </v-card-actions>
    </v-card>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import { useI18n } from 'vue-i18n';

import Btn from '@/components/common/Btn.vue';
import { Common } from '@/types/common';

const { t } = useI18n();

const isOpen = ref(false);

const { filterConditions } = defineProps<{
    filterConditions: Common.FilterCondition[];
}>();

const emit = defineEmits([
    'on:submit',
    'on:reset',
    'update:condition',
]);

/** 開關收合篩選器 */
const toggleFilter = (open: boolean) => {
    isOpen.value = open;
};

const onReset = () => {
    emit('on:reset');
};

const onSubmit = () => {
    emit('on:submit');
    toggleFilter(false);
};

const onConditionUpdate = (key: string) => {
    emit('update:condition', key);
};

defineExpose({ toggleFilter });
</script>
<style lang="css" scoped>
/* :deep(.v-expansion-panel-text) {
    border-bottom-right-radius: 10px;
    border-bottom-left-radius: 10px;
} */
</style>

<template>
    <v-dialog
        v-model="openDialog"
        :persistent="!dialogConfig.readonly"
    >
        <template
            v-if="enableActivator"
            #activator="{ props }"
        >
            <!-- text -->
            <v-btn
                v-if="!activatorConfig.useIconActivator"
                v-bind="props"
                :text="dialogConfig.title"
                :color="dialogConfig.color"
                :append-icon="activatorConfig.appendIcon"
                :block="activatorConfig.block"
                @click="onInit"
            />

            <!-- icon -->
            <v-btn
                v-if="activatorConfig.useIconActivator"
                v-bind="props"
                variant="text"
                :color="activatorConfig.color"
                :icon="activatorConfig.activatorIcon"
                @click="onInit"
            />
        </template>

        <v-card
            :loading="inProgress"
            :disabled="inProgress"
            rounded="lg"
        >
            <v-card-title :class="`bg-${dialogConfig.color}`">
                <v-row class="align-center">
                    <v-col
                        cols="auto"
                        class="text-h6"
                    >
                        {{ dialogConfig.title }}
                    </v-col>
                    <v-col
                        cols="auto"
                        class="ml-auto"
                    >
                        <v-btn
                            color="white"
                            icon="mdi-close"
                            variant="text"
                            @click="toggleDialog(false)"
                        />
                    </v-col>
                </v-row>

                <slot name="titleTabs" />
            </v-card-title>

            <v-card-text class="overflow-y-auto">
                <!-- 植入自定義 body -->
                <slot />
            </v-card-text>

            <v-divider />

            <v-card-actions>
                <slot name="actionsPrepend" />

                <v-spacer />
                <!-- 新增/編輯模式 -->
                <template v-if="!dialogConfig.readonly">
                    <v-btn
                        color="success"
                        variant="text"
                        :disabled="disableSubmit"
                        :text="t('button.confirm')"
                        @click="onSubmit"
                    />
                    <v-btn
                        color="error"
                        variant="text"
                        :text="t('button.cancel')"
                        @click="toggleDialog(false)"
                    />
                </template>
                <!-- 預覽模式 -->
                <template v-else>
                    <v-btn
                        variant="text"
                        :titexttle="t('button.close')"
                        @click="toggleDialog(false)"
                    />
                </template>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const openDialog = ref(false);

const {
    inProgress,
    enableActivator,
    activatorConfig,
    dialogConfig,
    disableSubmit,
} = withDefaults(defineProps<{
    inProgress: boolean;
    /**
     * 是否使用啟動按鈕
     * @default true
     */
    enableActivator?: boolean;
    activatorConfig?: {
        /**
         * 啟動按鈕是否 block
         * @default false
         */
        block?: boolean;
        appendIcon?: string;
        /**
         * 是否使用 icon 作為按鈕
         */
        useIconActivator?: boolean;
        activatorIcon?: string;
        color?: string;
    };
    dialogConfig: {
        title: string;
        color: string;
        readonly: boolean;
    };
    /**
     * 禁能 submit
     */
    disableSubmit?: boolean;
}>(), {
    inProgress: false,
    enableActivator: true,
    activatorConfig: () => ({
        block: false,
        appendIcon: undefined,
        useIconActivator: false,
        activatorIcon: undefined,
        color: 'default',
    }),
    disableSubmit: undefined,
});

/** 開關 Dialog */
const toggleDialog = (open: boolean) => {
    openDialog.value = open;
};

const emit = defineEmits(['dialog:init', 'update:submit']);

const onInit = () => emit('dialog:init');
const onSubmit = () => emit('update:submit');

/** 開啟 dialog */
const open = () => {
    onInit();
    toggleDialog(true);
};

const close = () => toggleDialog(false);

defineExpose({
    open,
    close,
});
</script>

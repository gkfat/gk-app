import {
    computed,
    ref,
} from 'vue';

import { defineStore } from 'pinia';

import { Notify } from '@/types/notifier';
import { randomId } from '@/utils/common';

/** 同時顯示的最多通知數量 */
const MAXIMUM_NOTIFY = 6;

const presetSettings = {
    info: {
        color: 'info',
        timeout: 5000,
    },
    error: {
        color: 'error',
        timeout: 5000,
    },
    warning: {
        color: 'warning',
        timeout: 5000,
    },
    success: {
        color: 'success',
        timeout: 5000,
    },
};

const createNotifierItem = (options: Notify.Options): Notify.Item => ({
    id: randomId(),
    content: options.content || '',
    color: options.color || 'info',
    timeout: options.timeout || 5000,
});

export const useNotifierStore = defineStore('notifier', () => {
    const list = ref([] as Notify.Item[]);

    /** 等待顯示的通知 */
    const queue = ref([] as Notify.Item[]);

    /** 是否達到最大顯示數量 */
    const reachedMaximum = computed(() => list.value.length >= MAXIMUM_NOTIFY);

    /** 新增通知 */
    const add = (options: Notify.Options) => {
        const item = createNotifierItem(options);
        if (reachedMaximum.value) {
            queue.value.push(item);
        } else {
            list.value.push(item);
        }
        return item.id;
    };

    /** 增加 Error 類型的通知 */
    const error = (options: Notify.Options) => add({
        ...presetSettings.error,
        ...options,
    });

    /** 增加 Success 類型的通知 */
    const success = (options: Notify.Options) => add({
        ...presetSettings.success,
        ...options,
    });

    /** 增加 Warn 類型的通知 */
    const warning = (options: Notify.Options) => add({
        ...presetSettings.warning,
        ...options,
    });

    /** 增加 Info 類型的通知 */
    const info = (options: Notify.Options) => add({
        ...presetSettings.info,
        ...options,
    });

    /** 移除通知 */
    const remove = (id: string) => {
        const index = list.value.findIndex((item) => item.id === id);
        if (index === -1) {
            return null;
        }

        const item = list.value[index];
        list.value.splice(index, 1);

        return item;
    };

    return {
        list,
        queue,
        add,
        success,
        info,
        warning,
        error,
        remove,
    };
});

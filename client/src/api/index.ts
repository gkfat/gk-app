import { Store } from 'pinia';

export const context = new Map();

/** 注入依賴 vue context, 避免 import cycle */
export const injectVueContext = (authStore: Store<'auth'>, appStore: Store<'app'>) => {
    if (!context.has('authStore')) {
        context.set('authStore', authStore);
    }

    if (!context.has('appStore')) {
        context.set('appStore', appStore);
    }
};

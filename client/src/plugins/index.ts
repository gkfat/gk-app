import type { App } from 'vue';

import router from '@/router';

import { i18n } from './i18n';
import { pinia } from './pinia';
import VueDatePicker from './vue-datepicker';
import { vuetify } from './vuetify';

export const registerPlugins = (app: App) => {
    app.component('VueDatePicker', VueDatePicker);

    app
        .use(i18n)
        .use(vuetify)
        .use(router)
        .use(pinia);
};

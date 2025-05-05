import './charts';

import type { App } from 'vue';

import Vue3GoogleLogin from 'vue3-google-login';

import router from '@/router';

import { i18n } from './i18n';
import { pinia } from './pinia';
import VueDatePicker from './vue-datepicker';
import JsonViewer from './vue-json-viewer';
import { vuetify } from './vuetify';

export const registerPlugins = (app: App) => {
    app.component('VueDatePicker', VueDatePicker);

    app
        .use(i18n)
        .use(vuetify)
        .use(JsonViewer)
        .use(router)
        .use(Vue3GoogleLogin, { clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID })
        .use(pinia);
};

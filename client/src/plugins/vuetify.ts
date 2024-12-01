import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';

import { useI18n } from 'vue-i18n';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import colors from 'vuetify/lib/util/colors.mjs';
import { createVueI18nAdapter } from 'vuetify/locale/adapters/vue-i18n';

import { i18n } from './i18n';

export const vuetify = createVuetify({
    components: {
        ...components,
    },
    directives,
    locale: {
        adapter: createVueI18nAdapter({ i18n, useI18n }),
    },
    theme: {
        themes: {
            light: {
                dark: false,
                colors: {
                    primary: colors.teal.darken2,
                    lightgreen: colors.green.lighten4,
                    secondary: colors.teal.lighten1,
                    grey: colors.grey.lighten2,
                    darkgrey: colors.grey.darken2,
                    warn: colors.amber.lighten2,
                    info: colors.blue.lighten1,
                    darkinfo: colors.blue.darken3,
                    error: colors.red.lighten1,
                    lightred: colors.red.lighten3,
                    success: colors.green.base,
                },
            },
            dark: {
                dark: true,
                colors: {
                    warn: colors.amber.lighten2,
                    grey: colors.grey.darken2,
                    darkinfo: colors.blue.darken3,
                },
            },
        },
    },
});

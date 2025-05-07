import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';

import { useI18n } from 'vue-i18n';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { createVueI18nAdapter } from 'vuetify/locale/adapters/vue-i18n';
import colors from 'vuetify/util/colors';

import { i18n } from './i18n';

const colorPalette = {
    primary: '#838B84',
    secondary: '#8E8E8C',
    lightPrimary: '#C3C1BD',
    light: '#EFEFEF',
};

const getContrastColor = (hexColor: string) => {
    // Luminance-based contrast check
    const c = hexColor.substring(1);
    const rgb = parseInt(c, 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = rgb & 0xff;
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    return luminance > 186 ? '#000000' : '#FFFFFF';
};

export const vuetify = createVuetify({
    components: { ...components },
    directives,
    locale: {
        adapter: createVueI18nAdapter({
            i18n, useI18n, 
        }), 
    },
    theme: {
        defaultTheme: 'light',
        themes: {
            light: {
                dark: false,
                colors: {
                    primary: colorPalette.primary,
                    'on-primary': getContrastColor(colorPalette.primary),
                    secondary: colorPalette.secondary,
                    'on-secondary': getContrastColor(colorPalette.secondary),
                    background: colors.shades.white,
                    surface: colorPalette.light,
                    'on-surface': '#000000',
                    accent: '#A3BE8C',
                    info: '#2196F3',
                    success: '#4CAF50',
                    warning: '#FFC107',
                    error: colors.red.darken2,
                },
            },
            dark: {
                dark: true,
                colors: {
                    primary: colorPalette.lightPrimary,
                    'on-primary': getContrastColor(colorPalette.lightPrimary),
                    secondary: colorPalette.light,
                    'on-secondary': getContrastColor(colorPalette.light),
                    background: '#121212',
                    surface: '#1E1E1E',
                    'on-surface': '#FFFFFF',
                    accent: '#A3BE8C',
                    info: '#90CAF9',
                    success: '#81C784',
                    warning: '#FFD54F',
                    error: '#E57373',
                },
            },
        },
    },
});

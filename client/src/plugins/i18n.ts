import { createI18n } from 'vue-i18n';
import { zhHant } from 'vuetify/lib/locale/index';

const loadLocaleMessages = () => {
    const messages: {[key: string]: any } = {};

    const files = import.meta.glob('@/locales/*.json', {
        eager: true, as: 'raw', 
    });

    for (let paths = Object.keys(files), i = 0; i < paths.length; i += 1) {
        const path = paths[i];
        const locale = path.split('/').pop()!.replace('.json', '');
        messages[locale] = JSON.parse(files[path]);
    }

    // fix vuetify data table footer locale issue
    messages.zh = {
        ...messages.zh,
        $vuetify: zhHant,
    };

    return messages;
};

export const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    missingWarn: false,
    locale: 'zh',
    fallbackLocale: 'zh',
    messages: loadLocaleMessages(),
});

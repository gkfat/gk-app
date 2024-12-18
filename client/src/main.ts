// Plugins
import { createApp } from 'vue';

// Inject Vue Context
import { boot } from '@/boot';
import { registerPlugins } from '@/plugins';

import App from './App.vue';

const app = createApp(App);

registerPlugins(app);

boot();

app.mount('#app');

console.log(`App running in ${import.meta.env.MODE} mode, api url setting: ${import.meta.env.VITE_API_URL}}`);

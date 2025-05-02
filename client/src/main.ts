// Plugins
import { createApp } from 'vue';

// Inject Vue Context
import { boot } from '@/boot';
import { registerPlugins } from '@/plugins';

import App from './App.vue';
import { VERSION } from './version';

const app = createApp(App);

registerPlugins(app);

boot();

app.mount('#app');

console.log(`App mode: ${import.meta.env.MODE}, API url: ${import.meta.env.VITE_API_URL}, Version: ${VERSION}`);

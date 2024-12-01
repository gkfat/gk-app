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

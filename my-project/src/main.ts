import { createApp } from 'vue';
import './assets/styles/main.css';
import App from './App.vue';
import { createPinia } from 'pinia';
import { router } from './routes.ts';
const app = createApp(App);
const pinia = createPinia();

app.use(router);
app.use(pinia);
app.mount('#app');

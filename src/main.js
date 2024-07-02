import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import axios from 'axios';
import VueAxios from 'vue-axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css'; // 引入 Element Plus 的 CSS

import App from './App.vue';
import router from './router';

const app = createApp(App);

app.use(createPinia());
app.use(ElementPlus);
app.use(VueAxios, axios);
app.use(router);

app.mount('#app');

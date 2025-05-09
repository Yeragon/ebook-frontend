// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import request from '@/utils/request';

// Create a Vue instance
const app = createApp(App);

// fake login It is used for development and testing. The official version can be removed
if (!localStorage.getItem('token')) {
  localStorage.setItem('token', 'aaaaaaa');
  localStorage.setItem('currentUser', JSON.stringify({
    userId: 1,
    email: 'test@example.com',
    name: 'Test User',
    avatar: 'https://via.placeholder.com/100',
    balance: 100
  }));
}

// global Configuration mode: axios
app.config.globalProperties.$axios = request;
app.use(router);
app.use(ElementPlus);
app.mount('#app');

//Made by Xiaoyao Yu Start date: 20/04/2025
// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import request from '@/utils/request';

// Create Vue instance
const app = createApp(App);

// Fake login for development/testing, can be removed in production
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

// Configure global axios instance
app.config.globalProperties.$axios = request;

// Mount plugins
app.use(router);
app.use(ElementPlus);

// Mount the app to the DOM
app.mount('#app');

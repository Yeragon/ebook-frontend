// src/utils/request.js
import axios from 'axios';
import { ElMessage } from 'element-plus';
import router from '@/router';

// 创建 axios 实例
const service = axios.create({
  baseURL: '/api',  // 根据你的项目API前缀，如果有的话
  timeout: 5000
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const token = currentUser?.token;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const status = error.response?.status;
    if (status === 401) {
      ElMessage.error('Session expired, please login again.');
      localStorage.removeItem('currentUser');
      router.push('/login');
    } else {
      ElMessage.error(error.response?.data?.message || 'Request failed.');
    }
    return Promise.reject(error);
  }
);

export default service;

// src/utils/request.js
import axios from 'axios';
import { ElMessage } from 'element-plus';
import router from '@/router';

const isDev = process.env.NODE_ENV === 'development';

const service = axios.create({
  baseURL: isDev ? 'http://localhost:3001' : '/api',
  timeout: 5000
});

// 请求拦截器（可选，开发阶段暂时注释 token）
service.interceptors.request.use(
  (config) => {
    // const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    // const token = currentUser?.token;
    // if (token) {
    //   config.headers['Authorization'] = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器
service.interceptors.response.use(
  (response) => response,
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
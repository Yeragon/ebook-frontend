// src/utils/request.js
import axios from 'axios';
import { ElMessage } from 'element-plus';
import router from '@/router';

// 创建 axios 实例
const service = axios.create({
  baseURL: '/api',  // 后端接口前缀
  timeout: 5000
});

// 请求拦截器：添加 token（如果有）
service.interceptors.request.use(
  (config) => {
    let currentUser = null;
    try {
      const stored = localStorage.getItem('currentUser');
      if (stored) {
        currentUser = JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Invalid JSON in localStorage for currentUser:', e);
    }

    const token = currentUser?.token;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器：统一处理返回格式和错误码
service.interceptors.response.use(
  (response) => {
    const res = response.data;

    // 后端返回的是统一格式 { code, message, data }
    if (res.code !== 200) {
      ElMessage.error(res.message || 'Request failed');
      return Promise.reject(new Error(res.message || 'Error'));
    }

    // 返回真正的业务数据部分
    return res.data;
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

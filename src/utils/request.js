// src/utils/request.js
import axios from 'axios';
import { ElMessage } from 'element-plus';
import router from '@/router';

// Create an instance of axios
const service = axios.create({
  baseURL: '/api',  // Backend interface prefix
  timeout: 5000
});

// Request Interceptor: Add token
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

// Response interceptor: Uniformly handles return formats and error codes
service.interceptors.response.use(
  (response) => {
    const res = response.data;

    // The format returned by the back end is uniform { code, message, data }
    if (res.code !== 200) {
      ElMessage.error(res.message || 'Request failed');
      return Promise.reject(new Error(res.message || 'Error'));
    }

    // Return to the real business data section
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

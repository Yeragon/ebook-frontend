//Made by Xiaoyao Yu  date:20/04/2025
// src/utils/request.js
import axios from 'axios';
import { ElMessage } from 'element-plus';
import router from '@/router';

// Create a custom Axios instance for HTTP requests
const service = axios.create({
  baseURL: '/api',  // API base URL
  timeout: 5000
});

// In the request interceptor, attach the token to the headers if it exists
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

// In the response interceptor, standardize the handling of response structure and error codes
service.interceptors.response.use(
  (response) => {
    const res = response.data;

    // The backend responses follow a unified structure with fields: code, message, and data
    if (res.code !== 200) {
      ElMessage.error(res.message || 'Request failed');
      return Promise.reject(new Error(res.message || 'Error'));
    }

    // Return actual data  
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

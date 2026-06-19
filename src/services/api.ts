import axios from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { config } from '../config/env';

const api: AxiosInstance = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (requestConfig: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      requestConfig.headers.Authorization = `Bearer ${token}`;
    }
    return requestConfig;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

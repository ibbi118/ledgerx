import axios from 'axios';
import { API_BASE_URL, TOKEN_KEY } from '../constants/config';

// Create the axios instance
const axiosInstance = axios.create({
   baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60s — transactions can take ~40s
});

// ─── Request Interceptor ────────────────────────────────────────────────────
// Attach JWT token from localStorage to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ───────────────────────────────────────────────────
// Handle 401 Unauthorized → clear storage and redirect to login
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem('ledgerx_user');
      // Redirect to login (only if not already there)
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

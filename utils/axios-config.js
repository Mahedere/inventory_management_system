
import axios from 'axios';
import { showError } from './notification';

// Set base URL
axios.defaults.baseURL = process.env.VUE_APP_API_URL || 'https://inventory-backend-sepia.vercel.app/api';

// Request interceptor for adding token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      window.location.href = '/login';
    }
    showError(error);
    return Promise.reject(error);
  }
);

export default axios;
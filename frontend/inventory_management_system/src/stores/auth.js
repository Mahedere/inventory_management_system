import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    getUser: (state) => state.user,
    getError: (state) => state.error
  },

  actions: {
    async login(credentials) {
      try {
        this.loading = true;
        this.error = null;

        const response = await axios.post('http://localhost:5000/api/auth/login', credentials);

        const { token, ...user } = response.data;
        this.token = token;
        this.user = user;

        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`; // Fixed backticks

        return true;
      } catch (error) {
        this.error = error.response?.data?.message || 'Login failed';
        return false;
      } finally {
        this.loading = false;
      }
    },

    async register(userData) {
      try {
        this.loading = true;
        this.error = null;

        const response = await axios.post('http://localhost:5000/api/auth/register', userData);

        const { token, ...user } = response.data;
        this.token = token;
        this.user = user;

        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`; // Fixed backticks

        return true;
      } catch (error) {
        this.error = error.response?.data?.message || 'Registration failed';
        return false;
      } finally {
        this.loading = false;
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    },

    clearError() {
      this.error = null;
    }
  }
});

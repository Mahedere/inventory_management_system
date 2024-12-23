import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    getUser: (state) => state.user,
    getError: (state) => state.error,
    userRole: (state) => state.user?.role || null,
  },

  actions: {
    async login(credentials) {
      try {
        this.loading = true;
        this.error = null;

        const response = await axios.post(
          'https://inventory-backend-sepia.vercel.app/api/auth/login',
          credentials
        );

        const { token, ...user } = response.data;

        if (!user.role) {
          throw new Error('Invalid user role');
        }

        this.token = token;
        this.user = user;

        localStorage.setItem('token', token);
        localStorage.setItem('userData', JSON.stringify(user));
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        return { success: true };
      } catch (error) {
        console.error('Login error:', error);
        this.error = error.response?.data?.message || 'Login failed';
        return { success: false };
      } finally {
        this.loading = false;
      }
    },

    async register(userData) {
      try {
        this.loading = true;
        this.error = null;

        const response = await axios.post(
          'https://inventory-backend-sepia.vercel.app/api/auth/register',
          userData
        );

        const { token, ...user } = response.data;

        this.token = token;
        this.user = user;

        localStorage.setItem('token', token);
        localStorage.setItem('userData', JSON.stringify(user));
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        return { success: true };
      } catch (error) {
        console.error('Registration error:', error);
        this.error = error.response?.data?.message || 'Registration failed';
        return { success: false };
      } finally {
        this.loading = false;
      }
    },

    async forgotPassword(email) {
      try {
        this.loading = true;
        this.error = null;

        await axios.post('https://inventory-backend-sepia.vercel.app/api/auth/forgot-password', {
          email,
        });

        return { success: true };
      } catch (error) {
        console.error('Forgot password error:', error);
        this.error =
          error.response?.data?.message || 'Failed to send reset password email';
        return { success: false };
      } finally {
        this.loading = false;
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      delete axios.defaults.headers.common['Authorization'];
    },

    clearError() {
      this.error = null;
    },

    initAuth() {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('userData');

        if (token && userData) {
          this.token = token;
          this.user = JSON.parse(userData);
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        this.logout();
      }
    },
  },
});

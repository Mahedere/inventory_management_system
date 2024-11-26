import { defineStore } from 'pinia';
import api from '@/services/api';

export const useUserStore = defineStore('users', {
  state: () => ({
    users: [],
    loading: false,
    error: null
  }),

  getters: {
    guestUsers: (state) => 
      state.users.filter(user => !user.role || user.role === 'guest'),

    assignedUsers: (state) =>
      state.users.filter(user => user.role && user.role !== 'guest'),

    totalUsers: (state) =>
      state.users.length,

    storekeepersCount: (state) =>
      state.users.filter(user => user.role === 'storekeeper' && user.isActive).length,

    salespersonsCount: (state) =>
      state.users.filter(user => user.role === 'salesperson' && user.isActive).length
  },

  actions: {
    async fetchUsers() {
      try {
        this.loading = true;
        const response = await api.get('/users');
        this.users = response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Error fetching users';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async assignRole(userId, role) {
      try {
        this.loading = true;
        const response = await api.patch(`/users/${userId}/role`, { role });
        
        // Update user in store
        const index = this.users.findIndex(user => user._id === userId);
        if (index !== -1) {
          this.users[index] = response.data;
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Error assigning role';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async toggleUserStatus(userId) {
      try {
        this.loading = true;
        const user = this.users.find(u => u._id === userId);
        const response = await api.patch(`/users/${userId}/status`, {
          isActive: !user.isActive
        });
        
        // Update user in store
        const index = this.users.findIndex(u => u._id === userId);
        if (index !== -1) {
          this.users[index] = response.data;
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Error updating user status';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    clearError() {
      this.error = null;
    }
  }
});
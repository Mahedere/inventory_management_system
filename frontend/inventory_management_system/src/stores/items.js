import { defineStore } from 'pinia';
import axios from '@/plugins/axios';

export const useItemsStore = defineStore('items', {
  state: () => ({
    items: [],
    loading: false,
    error: null,
    stats: {
      totalItems: 0,
      lowStockItems: 0,
      totalCategories: 0,
      totalValue: 0,
      trends: {
        items: 12,
        lowStock: -2,
        categories: 5,
        value: 8,
      },
    },
  }),

  getters: {
    // Get an item by ID
    getItemById: (state) => (id) => state.items.find((item) => item._id === id),

    // Filtered items based on search, category, and sort criteria
    filteredItems: (state) => (filters) => {
      let result = [...state.items];

      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        result = result.filter((item) =>
          item.name.toLowerCase().includes(searchLower) ||
          item.description.toLowerCase().includes(searchLower)
        );
      }

      if (filters.category) {
        result = result.filter((item) => item.category === filters.category);
      }

      if (filters.sort) {
        result.sort((a, b) => {
          switch (filters.sort) {
            case 'name':
              return a.name.localeCompare(b.name);
            case 'stock':
              return b.stock - a.stock;
            case 'price':
              return b.price - a.price;
            default:
              return 0;
          }
        });
      }

      return result;
    },

    // Get unique categories
    categories: (state) => {
      return [...new Set(state.items.map((item) => item.category))];
    },

    // Dashboard stats in a consumable format
    dashboardStats: (state) => ({
      totalItems: {
        value: state.stats.totalItems,
        trend: state.stats.trends.items,
        subtitle: 'From last month',
      },
      lowStockItems: {
        value: state.stats.lowStockItems,
        trend: state.stats.trends.lowStock,
        subtitle: 'Needs attention',
      },
      totalCategories: {
        value: state.stats.totalCategories,
        trend: state.stats.trends.categories,
        subtitle: 'Active categories',
      },
      totalValue: {
        value: state.stats.totalValue,
        trend: state.stats.trends.value,
        subtitle: 'Inventory worth',
        format: 'currency',
      },
    }),
  },

  actions: {
    // Fetch all items
    async fetchItems() {
      try {
        this.loading = true;
        const response = await axios.get('/api/items');
        this.items = response.data;
        this.updateStats();
      } catch (error) {
        this.error = error.response?.data?.message || 'Error fetching items';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Add a new item
    async addItem(itemData) {
      try {
        this.loading = true;
        const response = await axios.post('/api/items', itemData);
        this.items.push(response.data);
        this.updateStats();
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Error adding item';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Update an existing item
    async updateItem(itemId, itemData) {
      try {
        this.loading = true;
        const response = await axios.patch(`/api/items/${itemId}`, itemData);
        const index = this.items.findIndex((item) => item._id === itemId);
        if (index !== -1) {
          this.items[index] = response.data;
        }
        this.updateStats();
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Error updating item';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Delete an item
    async deleteItem(itemId) {
      try {
        this.loading = true;
        await axios.delete(`/api/items/${itemId}`);
        this.items = this.items.filter((item) => item._id !== itemId);
        this.updateStats();
      } catch (error) {
        this.error = error.response?.data?.message || 'Error deleting item';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Update stats based on current items
    updateStats() {
      const stats = {
        totalItems: this.items.length,
        lowStockItems: this.items.filter(
          (item) => item.stock / item.maxLimit < 0.2
        ).length,
        totalCategories: new Set(this.items.map((item) => item.category)).size,
        totalValue: this.items.reduce(
          (total, item) => total + item.price * item.stock,
          0
        ),
      };

      this.stats = {
        ...stats,
        trends: this.stats.trends, // Retain previous trends
      };
    },

    // Clear error
    clearError() {
      this.error = null;
    },

    // Reset the store
    resetStore() {
      this.items = [];
      this.loading = false;
      this.error = null;
      this.updateStats();
    },
  },
});

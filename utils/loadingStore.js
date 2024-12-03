import { defineStore } from 'pinia';

export const useLoadingStore = defineStore('loading', {
  state: () => ({
    isLoading: false,
    loadingText: 'Loading...'
  }),
  
  actions: {
    startLoading(text = 'Loading...') {
      this.isLoading = true;
      this.loadingText = text;
    },
    
    stopLoading() {
      this.isLoading = false;
      this.loadingText = 'Loading...';
    }
  }
});
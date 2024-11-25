<template>
  <div class="flex flex-col space-y-4 mb-6 lg:flex-row lg:justify-between lg:items-center lg:space-y-0">
    <div class="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
      <div class="relative">
        <!-- Category Filter -->
        <select
          v-model="selectedCategory"
          @change="handleFiltersChange"
          class="px-4 py-2 pr-10 mr-1 rounded-lg border border-gray-300 appearance-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Categories</option>
          <option v-for="category in categories" :key="category" :value="category">
            {{ formatCategory(category) }}
          </option>
        </select>

        <!-- Sort Option -->
        <select
          v-model="sortOption"
          @change="handleFiltersChange"
          class="px-4 py-2 pr-10 rounded-lg border border-gray-300 appearance-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="name">Sort by Name</option>
          <option value="stock">Sort by Stock</option>
          <option value="price">Sort by Price</option>
        </select>
      </div>
    </div>

    <!-- Search -->
    <div class="relative mr-9 mt-2">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search..."
        class="pl-4 pr-10 py-2 rounded-lg border border-gray-300 w-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        @input="handleFiltersChange"
      >
      <SearchIcon class="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
    </div>

    <!-- Add Item Button -->
    <button
      @click="$emit('add-item')"
      class="w-full mt-2 px-4 py-2 text-white bg-indigo-600 rounded-lg sm:w-auto hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
    >
      <PlusIcon class="w-5 h-5 inline-block mr-1" />
      Add New Item
    </button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { SearchIcon, PlusIcon } from '@heroicons/vue/outline';

const props = defineProps({
  categories: {
    type: Array,
    default: () => ['electronics', 'clothing', 'furniture', 'books', 'other']
  }
});

const emit = defineEmits(['filter', 'search', 'sort', 'add-item']);

const searchQuery = ref('');
const selectedCategory = ref('');
const sortOption = ref('name');

const formatCategory = (category) => {
  return category.charAt(0).toUpperCase() + category.slice(1);
};

const handleFiltersChange = () => {
  emit('filter', {
    search: searchQuery.value,
    category: selectedCategory.value,
    sort: sortOption.value
  });
};

// Debounce search to prevent too many emissions
let debounceTimeout;
watch(searchQuery, () => {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    handleFiltersChange();
  }, 300);
});
</script>
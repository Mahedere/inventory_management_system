<template>
  <div
    class="fixed inset-y-0 left-0 transform lg:relative lg:translate-x-0 transition duration-200 ease-in-out lg:w-64 bg-white shadow-lg z-40"
    :class="{ '-translate-x-full': !isOpen }"
  >
    <div class="flex items-center p-4 border-b">
      <div class="text-xl font-bold text-indigo-600">Inventory</div>
      <button @click="$emit('close')" class="ml-auto lg:hidden p-2">
        <svg class="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <nav class="p-4 space-y-2">
      <router-link 
        v-for="item in menuItems" 
        :key="item.path"
        :to="item.path"
        class="flex items-center p-3 rounded-lg"
        :class="[
          route.path === item.path 
            ? 'text-indigo-600 bg-indigo-50' 
            : 'text-gray-600 hover:bg-gray-50'
        ]"
      >
        <component :is="item.icon" class="w-5 h-5" />
        <span class="ml-2">{{ item.name }}</span>
      </router-link>
    </nav>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import {
  ViewGridIcon,
  ArchiveIcon,
  DocumentTextIcon
} from '@heroicons/vue/outline';

const route = useRoute();

defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
});

defineEmits(['close']);

const menuItems = [
  {
    name: 'Dashboard',
    path: '/store-dashboard',
    icon: ViewGridIcon
  },
  {
    name: 'Inventory',
    path: '/inventory',
    icon: ArchiveIcon
  },
  {
    name: 'Sales',
    path: '/sales',
    icon: DocumentTextIcon
  }
];
</script>
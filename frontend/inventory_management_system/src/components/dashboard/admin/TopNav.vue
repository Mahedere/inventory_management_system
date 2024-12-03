<template>
  <header class="bg-white border-b px-4 lg:px-6 py-4 w-full">
    <div class="flex items-center justify-between">
      <!-- Left-aligned title -->
      <div class="flex items-center space-x-4">
        <div class="text-xl font-bold text-indigo-600">
          Admin Dashboard
        </div>
      </div>

      <!-- Right-aligned user menu -->
      <div class="relative" ref="userMenuContainer">
        <button class="flex items-center justify-stretch" @click="toggleUserMenu">
          <div class="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200">
            <UserIcon class="w-5 h-5 text-gray-600" />
          </div>
          <ChevronDownIcon class="w-5 h-5 text-gray-600" :class="{ 'transform rotate-180': isUserMenuOpen }" />
        </button>

        <!-- Dropdown Menu -->
        <div v-show="isUserMenuOpen" class="absolute right-0 z-10 mt-2 w-26 rounded-md bg-white shadow-lg py-1">
          <a v-for="item in userMenuItems" :key="item.name" @click="handleMenuItemClick(item)"
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
            {{ item.name }}
          </a>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import {
  BellIcon,
  UserIcon,
  ChevronDownIcon
} from '@heroicons/vue/outline';

const router = useRouter();
const authStore = useAuthStore();

const isUserMenuOpen = ref(false);
const userMenuContainer = ref(null);
const userMenuItems = [
  { name: 'Logout', action: 'logout' }
];

const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value;
};

const handleClickOutside = (event) => {
  if (userMenuContainer.value && !userMenuContainer.value.contains(event.target)) {
    isUserMenuOpen.value = false;
  }
};

const handleMenuItemClick = (item) => {
  switch (item.action) {
    case 'logout':
      authStore.logout();
      router.push('/login');
      break;
  }
  isUserMenuOpen.value = false;
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

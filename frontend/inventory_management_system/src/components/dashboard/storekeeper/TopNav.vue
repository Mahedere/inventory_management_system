<template>
  <header class="bg-white border-b px-4 lg:px-6 py-4">
    <div class="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
      <div class="flex-1 ml-12 lg:ml-0">
        <h1 class="text-xl font-semibold text-gray-900 lg:text-2xl">
          Morning, <span>{{ userName }}</span>!
        </h1>
        <p class="text-sm text-gray-500">Here's what's happening with your store today.</p>
      </div>
      
      <div class="flex ml-15 flex-col items-start space-y-4 lg:flex-row lg:items-center lg:space-y-0 lg:space-x-4">
        <div class="flex items-center space-x-4">
          <!-- Notifications -->
          <button class="p-2 text-gray-400 hover:text-gray-600">
            <BellIcon class="w-6 h-6" />
          </button>

          <!-- User Menu -->
          <div class="relative" ref="userMenuContainer">
            <button 
              class="flex items-center justify-stretch"
              @click="toggleUserMenu"
            >
              <div class="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200">
                <UserIcon class="w-5 h-5 text-gray-600" />
              </div>
              <ChevronDownIcon 
                class="w-5 h-5 text-gray-600"
                :class="{ 'transform rotate-180': isUserMenuOpen }"
              />
            </button>

            <!-- Dropdown Menu -->
            <div
              v-show="isUserMenuOpen"
              class="absolute right-0 z-10 mt-2 w-48 rounded-md bg-white shadow-lg py-1"
            >
              <a 
                v-for="item in userMenuItems" 
                :key="item.name"
                @click="handleMenuItemClick(item)"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                {{ item.name }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import {
  BellIcon,
  UserIcon,
  ChevronDownIcon
} from '@heroicons/vue/outline';

const router = useRouter();
const authStore = useAuthStore();

const props = defineProps({
  userName: {
    type: String,
    default: 'User'
  }
});

const isUserMenuOpen = ref(false);
const userMenuContainer = ref(null);

const userMenuItems = [
  { name: 'Profile', action: 'profile' },
  { name: 'Settings', action: 'settings' },
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
    case 'profile':
      router.push('/profile');
      break;
    case 'settings':
      router.push('/settings');
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

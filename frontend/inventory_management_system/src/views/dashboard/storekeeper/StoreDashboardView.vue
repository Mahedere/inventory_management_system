<template>
  <div class="bg-gray-50 min-h-screen">
    <!-- Sidebar Overlay -->
    <div v-if="isSidebarOpen" class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" @click="toggleSidebar">
    </div>

    <div class="flex h-screen overflow-hidden">
      <!-- Sidebar -->
      <aside :class="[
        'fixed inset-y-0 left-0 transform lg:relative lg:translate-x-0 transition-transform duration-200 ease-in-out',
        'w-64 bg-white shadow-lg z-50',
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      ]">
        <div class="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <h1 class="text-xl font-bold text-indigo-600">Inventory</h1>
          <button class="lg:hidden" @click="toggleSidebar">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav class="p-4 space-y-2">
          <router-link to="/store-dashboard" class="flex items-center p-3 text-indigo-600 bg-indigo-50 rounded-lg"
            active-class="text-indigo-600 bg-indigo-50">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span class="ml-3">Dashboard</span>
          </router-link>
          <router-link to="/inventory" class="flex items-center p-3 text-gray-600 hover:bg-gray-50 rounded-lg"
            active-class="text-indigo-600 bg-indigo-50">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <span class="ml-3">Inventory</span>
          </router-link>
          <router-link to="/sales-report" class="flex items-center p-3 text-gray-600 hover:bg-gray-50 rounded-lg"
            active-class="text-indigo-600 bg-indigo-50">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <span class="ml-3">Sales Report</span>
          </router-link>
        </nav>
      </aside>

      <!-- Main Content -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Top Navigation -->
        <header class="bg-white border-b px-4 lg:px-6 py-4 w-full">
          <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <!-- Welcome Text -->
            <div class="flex-1 flex flex-col items-center text-center lg:text-left lg:items-start lg:mr-auto">
              <h2 class="text-xl font-semibold text-gray-900 lg:text-2xl">Welcome, {{ userName }}</h2>
              <p class="text-sm text-gray-500">Here's your inventory overview</p>
            </div>

            <!-- Top Row: Hamburger Menu and Dropdown for Mobile -->
            <div class="flex items-center justify-between lg:justify-end w-full lg:w-auto">
              <!-- Mobile Menu Button -->
              <button @click="toggleSidebar" class="p-2 rounded-lg bg-white shadow-lg lg:hidden">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              </button>

              <!-- User Dropdown -->
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
          </div>
        </header>

        <!-- Main Content Area -->
        <main class="flex-1 overflow-y-auto bg-gray-50 p-4 lg:p-6">
          <!-- Stats Grid -->
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
            <div v-for="stat in dashboardStats" :key="stat.title" class="bg-white rounded-lg shadow p-4">
              <div class="flex items-center justify-between mb-2">
                <h3 class="text-sm font-medium text-gray-500">{{ stat.title }}</h3>
                <span :class="[
                  'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
                  stat.trend > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                ]">
                  {{ stat.trend > 0 ? '↑' : '↓' }} {{ Math.abs(stat.trend) }}%
                </span>
              </div>
              <p class="text-2xl font-bold text-gray-900">{{ stat.value }}</p>
              <p class="text-sm text-gray-500">{{ stat.subtitle }}</p>
            </div>
          </div>

          <!-- Control Bar -->
          <div class="bg-white rounded-lg shadow p-4 mb-6">
            <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <!-- Filter Controls -->
              <div class="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                <select v-model="filters.category"
                  class="rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500">
                  <option value="">All Categories</option>
                  <option v-for="category in categories" :key="category" :value="category">
                    {{ category }}
                  </option>
                </select>
                <select v-model="filters.sortBy"
                  class="rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500">
                  <option value="name">Sort by Name</option>
                  <option value="quantity">Sort by Stock</option>
                  <option value="price">Sort by Price</option>
                </select>
              </div>

              <!-- Search and Add -->
              <div class="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                <input v-model="filters.search" type="text" placeholder="Search items..."
                  class="rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500">
                <button @click="openModal()" class="inline-flex justify-center items-center px-4 py-2 border border-transparent 
                    rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Add New Item
                </button>
              </div>
            </div>
          </div>

          <!-- Items Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="item in filteredItems" :key="item._id" class="bg-white rounded-lg shadow p-4">
              <div class="flex justify-between items-start mb-4">
                <div>
                  <h3 class="text-lg font-medium text-gray-900">{{ item.name }}</h3>
                  <p class="text-sm text-gray-500">{{ item.category }}</p>
                </div>
                <div class="flex space-x-2">
                  <button @click="openModal(item)" class="text-gray-400 hover:text-indigo-600">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button @click="deleteItem(item)" class="text-gray-400 hover:text-red-600">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              <p class="text-sm text-gray-600 mb-4">{{ item.description }}</p>
              <p class="text-sm text-gray-500 mb-1">Model: {{ item.model }}</p>
              <div class="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p class="text-sm text-gray-500">Stock Level</p>
                  <p class="font-medium">{{ item.quantity }}/{{ item.maxLimit }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Price</p>
                  <p class="font-medium">{{ formatPrice(item.price) }}</p>
                </div>
              </div>
              <div class="relative pt-1">
                <div class="overflow-hidden h-2 text-xs flex rounded bg-gray-100">
                  <div :class="getStockBarClass(item)" :style="{ width: `${(item.quantity / item.maxLimit * 100)}%` }"
                    class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center">
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- Pagination Controls -->
          <div class="mt-4 flex justify-center items-center space-x-4">
            <button @click="goToPage(currentPage - 1)" :disabled="currentPage <= 1"
              class="px-4 py-2 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-gray-300">
              Previous
            </button>
            <span class="text-sm text-gray-700">
              Page {{ currentPage }} of {{ totalPages }}
            </span>
            <button @click="goToPage(currentPage + 1)" :disabled="currentPage >= totalPages"
              class="px-4 py-2 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-gray-300">
              Next
            </button>
          </div>

        </main>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <TransitionRoot appear :show="showModal" as="template">
      <Dialog as="div" class="relative z-50" @close="closeModal">
        <TransitionChild enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
          leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0" as="template">
          <div class="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <TransitionChild enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95" as="template">
              <DialogPanel
                class="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle as="h3" class="text-lg font-medium text-gray-900 mb-4">
                  {{ editingItem ? 'Edit Item' : 'Add New Item' }}
                </DialogTitle>

                <form @submit.prevent="handleSubmit" class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Name</label>
                    <input type="text" v-model="formData.name" required
                      class="mt-1 block w-full rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 p-2">
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700">Description</label>
                    <textarea v-model="formData.description" rows="3" required
                      class="mt-1 block w-full rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 p-2">
                    </textarea>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700">Model</label>
                    <input type="text" v-model="formData.model" required
                      class="mt-1 block w-full rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 p-2">
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Category</label>
                      <select v-model="formData.category" required
                        class="mt-1 block w-full rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 p-2">
                        <option v-for="category in categories" :key="category" :value="category">
                          {{ category }}
                        </option>
                      </select>
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700">Quantity</label>
                      <input type="number" v-model.number="formData.quantity" required min="0"
                        class="mt-1 block w-full rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 p-2">
                    </div>
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Price</label>
                      <input type="number" v-model.number="formData.price" required min="0" step="0.01"
                        class="mt-1 block w-full rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 p-2">
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700">Max Limit</label>
                      <input type="number" v-model.number="formData.maxLimit" required min="0"
                        class="mt-1 block w-full rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 p-2">
                    </div>
                  </div>

                  <div class="flex justify-end space-x-3 mt-6">
                    <button type="button" @click="closeModal"
                      class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                      Cancel
                    </button>
                    <button type="submit"
                      class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      {{ editingItem ? 'Update' : 'Add' }} Item
                    </button>
                  </div>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>
<script setup>
import { ref, onBeforeUnmount, computed, onMounted } from 'vue';
import axios from 'axios';
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { BellIcon, UserIcon, ChevronDownIcon } from '@heroicons/vue/outline';

// State
const isSidebarOpen = ref(false);
const isUserMenuOpen = ref(false);
const showModal = ref(false);
const editingItem = ref(null);
const items = ref([]);
const userMenuContainer = ref(null);
const userName = ref('');
const router = useRouter();
const authStore = useAuthStore();
const itemsPerPage = 6;
const currentPage = ref(1);

const filters = ref({
  search: '',
  category: '',
  sortBy: 'name',
});

const totalPages = computed(() => Math.ceil(items.value.length / itemsPerPage));
const goToPage = (page) => {
  if (page > 0 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const filteredItems = computed(() => {
  let result = items.value;

  // Apply search filter
  if (filters.value.search) {
    result = result.filter(item =>
      item.name.toLowerCase().includes(filters.value.search.toLowerCase())
    );
  }

  // Apply category filter
  if (filters.value.category) {
    result = result.filter(item => item.category === filters.value.category);
  }

  // Apply sorting
  if (filters.value.sortBy) {
    result.sort((a, b) => {
      if (filters.value.sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (filters.value.sortBy === 'quantity') {
        return b.quantity - a.quantity; // Sort descending
      } else if (filters.value.sortBy === 'price') {
        return b.price - a.price; // Sort descending
      }
    });
  }

  // Pagination
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  return result.slice(start, end);
});

const userMenuItems = [
  { name: 'Logout', action: 'logout' },
];

const categories = ['electronics', 'clothing', 'furniture', 'books', 'other'];

// Methods
const handleMenuItemClick = (item) => {
  switch (item.action) {
    case 'logout':
      authStore.logout();
      router.push('/login');
      break;
  }
  isUserMenuOpen.value = false;
};

const handleClickOutside = (event) => {
  if (userMenuContainer.value && !userMenuContainer.value.contains(event.target)) {
    isUserMenuOpen.value = false;
  }
};

const formData = ref({
  name: '',
  description: '',
  model: '',
  category: 'electronics',
  quantity: 0,
  price: 0,
  maxLimit: 0,
});

const dashboardStats = computed(() => [
  {
    title: 'Total Items',
    value: items.value.length,
    trend: 12,
    subtitle: 'From last month',
  },
  {
    title: 'Low Stock Items',
    value: items.value.filter(item => (item.quantity / item.maxLimit) < 0.2).length,
    trend: -2,
    subtitle: 'Needs attention',
  },
  {
    title: 'Total Categories',
    value: new Set(items.value.map(item => item.category)).size,
    trend: 5,
    subtitle: 'Active categories',
  },
  {
    title: 'Total Value',
    value: formatPrice(items.value.reduce((total, item) => total + (item.price * item.quantity), 0)),
    trend: 8,
    subtitle: 'Inventory worth',
  },
]);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value;
};

const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

const getStockBarClass = (item) => {
  const percentage = (item.quantity / item.maxLimit) * 100;
  return percentage < 20 ? 'bg-red-500' :
    percentage < 50 ? 'bg-yellow-500' : 'bg-green-500';
};

const fetchItems = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/items', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    items.value = response.data;
  } catch (error) {
    console.error('Error fetching items:', error);
  }
};

const handleSubmit = async () => {
  try {
    const method = editingItem.value ? 'patch' : 'post';
    const url = editingItem.value
      ? `http://localhost:5000/api/items/${editingItem.value._id}`
      : 'http://localhost:5000/api/items';

    const data = {
      name: formData.value.name,
      description: formData.value.description,
      model: formData.value.model,
      category: formData.value.category,
      quantity: formData.value.quantity,
      maxLimit: formData.value.maxLimit,
      price: formData.value.price,
    };

    await axios({
      method,
      url,
      data,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });

    await fetchItems();
    closeModal();
  } catch (error) {
    console.error('Error saving item:', error);
  }
};

const deleteItem = async (item) => {
  if (confirm('Are you sure you want to delete this item?')) {
    try {
      await axios.delete(`http://localhost:5000/api/items/${item._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      await fetchItems();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  }
};

const openModal = (item = null) => {
  editingItem.value = item;
  if (item) {
    formData.value = { ...item };
  } else {
    formData.value = {
      name: '',
      description: '',
      model: '',
      category: 'electronics',
      quantity: 0,
      price: 0,
      maxLimit: 0,
    };
  }
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  editingItem.value = null;
};

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userData');
  window.location.href = '/login';
};

// Lifecycle
onMounted(() => {
  fetchItems();
  const userData = localStorage.getItem('userData');
  if (userData) {
    const parsedData = JSON.parse(userData);
    userName.value = parsedData.name;
  }
});
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

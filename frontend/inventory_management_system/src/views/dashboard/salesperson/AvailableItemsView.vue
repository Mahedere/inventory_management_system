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
                    <h1 class="text-xl font-bold text-indigo-600">Sales Dashboard</h1>
                    <button class="lg:hidden" @click="toggleSidebar">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <nav class="p-4 space-y-2">
                    <router-link to="/sales-dashboard"
                        class="flex items-center p-3  text-gray-600 hover:bg-gray-50 rounded-lg"
                        active-class="text-indigo-600 bg-indigo-50">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                        <span class="ml-3">My Sales</span>
                    </router-link>
                    <router-link to="/available-items" class="flex items-center p-3 text-indigo-600 bg-indigo-50 rounded-lg"
                        active-class="text-indigo-600 bg-indigo-50">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <span class="ml-3">Available Items</span>
                    </router-link>
                </nav>
            </aside>

            <!-- Main Content -->
            <div class="flex-1 flex flex-col overflow-hidden">
                <!-- Top Navigation -->
                <header class="bg-white border-b px-4 lg:px-6 py-4 w-full">
                    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div
                            class="flex-1 flex flex-col items-center text-center lg:text-left lg:items-start lg:mr-auto">
                            <p class="text-sm text-gray-500">Here's all your inventory items</p>
                        </div>
                        <!-- Top Row: Hamburger Menu and Dropdown for Mobile -->
                        <div class="flex items-center justify-between lg:justify-end w-full lg:w-auto">
                            <!-- Mobile Menu Button -->
                            <button @click="toggleSidebar" class="p-2 rounded-lg bg-white shadow-lg lg:hidden">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round">
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
                                    <ChevronDownIcon class="w-5 h-5 text-gray-600"
                                        :class="{ 'transform rotate-180': isUserMenuOpen }" />
                                </button>

                                <!-- Dropdown Menu -->
                                <div v-show="isUserMenuOpen"
                                    class="absolute right-0 z-10 mt-2 w-26 rounded-md bg-white shadow-lg py-1">
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
                    <!-- Control Bar -->
                    <div class="bg-white rounded-lg shadow p-4 mb-6">
                        <div
                            class="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
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
                                    <div :class="getStockBarClass(item)"
                                        :style="{ width: `${(item.quantity / item.maxLimit * 100)}%` }"
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
    </div>
</template>
<script setup>
import { ref, onBeforeUnmount, computed, onMounted } from 'vue';
import axios from 'axios';
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
const itemsPerPage = 9;
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
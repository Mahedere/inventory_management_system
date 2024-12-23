<template>
    <div class="bg-gray-50 min-h-screen">
        <!-- Sidebar Overlay -->
        <div v-if="isSidebarOpen" class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" @click="toggleSidebar">
        </div>
        <div class="flex h-screen overflow-hidden">
            <!-- Sidebar Navigation -->
            <aside :class="[
                'fixed inset-y-0 left-0 transform lg:relative lg:translate-x-0 transition-transform duration-200 ease-in-out',
                'w-64 bg-white shadow-lg z-50',
                isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            ]">
                <div class="flex items-center p-4 border-b">
                    <div class="text-xl font-bold text-indigo-600">Sales Dashboard</div>
                    <button @click="toggleSidebar" class="ml-auto lg:hidden p-2">
                        <svg class="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <nav class="p-4 space-y-2">
                    <router-link to="/sales-dashboard"
                        class="flex items-center p-3 text-indigo-600 bg-indigo-50   rounded-lg"
                        active-class="text-indigo-600 bg-indigo-50">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                        <span class="ml-3">My Sales</span>
                    </router-link>
                    <router-link to="/available-items"
                        class="flex items-center p-3 text-gray-600 hover:bg-gray-50rounded-lg"
                        active-class="text-indigo-600 bg-indigo-50">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <span class="ml-3">Available Items</span>
                    </router-link>
                </nav>
            </aside>

            <!-- Main Content Area -->
            <div class="flex-1 flex flex-col overflow-hidden">
                <!-- Top Navigation Bar -->
                <header class="bg-white border-b px-4 lg:px-6 py-4 w-full">
                    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <!-- Welcome Text -->
                        <div
                            class="flex-1 flex flex-col items-center text-center lg:text-left lg:items-start lg:mr-auto">
                            <h2 class="text-xl font-semibold text-gray-900 lg:text-2xl">Welcome, {{ userName }}</h2>
                            <p class="text-sm text-gray-500">Here's what's happening with your sales today.</p>
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

                <!-- Main Content -->
                <main class="flex-1 overflow-y-auto bg-gray-50 p-4 lg:p-6">
                    <!-- Stats Grid -->
                    <div class="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-3">
                        <div class="bg-white p-4 rounded-lg shadow-sm lg:p-6">
                            <div class="flex items-start justify-between mb-4">
                                <h3 class="text-lg font-medium text-gray-900 mb-2">Today's Sales</h3>
                                <p class="text-3xl font-bold text-indigo-600">{{ formatPrice(todayStats.sales) }}</p>
                            </div>
                            <p class="text-sm text-gray-500 mt-2">Total sales for today</p>
                        </div>

                        <div class="bg-white p-4 rounded-lg shadow-sm lg:p-6">
                            <div class="flex items-start justify-between mb-4">
                                <h3 class="text-lg font-medium text-gray-900 mb-2">Monthly Sales</h3>
                                <p class="text-3xl font-bold text-indigo-600">{{ formatPrice(monthlyStats.sales) }}</p>
                            </div>
                            <p class="text-sm text-gray-500 mt-2">Total sales this month</p>
                        </div>

                        <div class="bg-white p-6 rounded-lg shadow-sm lg:p-6">
                            <div class="flex items-start justify-between mb-4">
                                <h3 class="text-lg font-medium text-gray-900 mb-2">Total Transactions</h3>
                                <p class="text-3xl font-bold text-indigo-600">{{ todayStats.transactions }}</p>
                            </div>
                            <p class="text-sm text-gray-500 mt-2">Number of sales today</p>
                        </div>
                    </div>

                    <!-- Actions Bar -->
                    <div
                        class="flex flex-col space-y-4 mb-6 lg:flex-row lg:justify-between lg:items-center lg:space-y-0">
                        <div class="search-container">
                            <input v-model="searchQuery" type="text" placeholder="Search sales..."
                                class="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500">
                        </div>
                        <button @click="openNewSaleModal"
                            class="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
                            Record New Sale
                        </button>
                    </div>

                    <!-- Recent Sales Table -->
                    <div>
                        <div class="bg-white shadow-md rounded-lg overflow-hidden">
                            <!-- Header -->
                            <div class="px-6 py-4 border-b border-gray-200">
                                <h2 class="text-lg font-medium text-gray-900">Recent Sales</h2>
                            </div>

                            <!-- Table -->
                            <div class="overflow-x-auto">
                                <!-- Table View for Larger Screens -->
                                <table class="min-w-full divide-y divide-gray-200 hidden md:table">
                                    <thead class="bg-gray-50">
                                        <tr>
                                            <th
                                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th
                                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Item
                                            </th>
                                            <th
                                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Customer
                                            </th>
                                            <th
                                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Quantity
                                            </th>
                                            <th
                                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Amount
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody class="bg-white divide-y divide-gray-200">
                                        <tr v-for="sale in filteredSales" :key="sale._id">
                                            <!-- Safely access sale properties -->
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {{ sale.saleDate ? formatDate(sale.saleDate) : 'N/A' }}
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {{ sale.item?.name || 'N/A' }}
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {{ sale.customerName || 'Unknown' }}
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {{ sale.quantity || 0 }}
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {{ sale.totalAmount ? formatPrice(sale.totalAmount) : '0.00' }}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>

                                <!-- Mobile View -->
                                <div class="space-y-4 md:hidden">
                                    <div v-for="sale in filteredSales" :key="sale._id"
                                        class="border rounded-lg p-4 shadow-sm bg-white">
                                        <div class="flex justify-between text-sm">
                                            <div class="font-medium text-gray-900">
                                                {{ sale.item?.name || 'N/A' }}
                                            </div>
                                            <div class="text-gray-500">
                                                {{ sale.saleDate ? formatDate(sale.saleDate) : 'N/A' }}
                                            </div>
                                        </div>
                                        <div class="text-sm text-gray-500 mt-1">
                                            <div>Customer: {{ sale.customerName || 'Unknown' }}</div>
                                            <div>Quantity: {{ sale.quantity || 0 }}</div>
                                            <div>Amount: {{ sale.totalAmount ? formatPrice(sale.totalAmount) : '0.00' }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <!-- Pagination -->
                            <div class="flex items-center justify-between px-6 py-3 border-t bg-gray-50">
                                <button @click="prevPage" :disabled="currentPage === 1"
                                    class="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 border rounded-md hover:bg-gray-200 disabled:opacity-50">
                                    Previous
                                </button>
                                <div class="text-sm text-gray-500">Page {{ currentPage }} of {{ totalPages }}</div>
                                <button @click="nextPage" :disabled="currentPage === totalPages"
                                    class="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 border rounded-md hover:bg-gray-200 disabled:opacity-50">
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>

        <!-- New Sale Modal -->
        <TransitionRoot appear :show="showSaleModal" as="template">
        <Dialog as="div" class="relative z-50" @close="closeNewSaleModal">
            <TransitionChild
                enter="duration-300 ease-out"
                enter-from="opacity-0"
                enter-to="opacity-100"
                leave="duration-200 ease-in"
                leave-from="opacity-100"
                leave-to="opacity-0"
                as="template"
            >
                <div class="fixed inset-0 bg-black bg-opacity-25" />
            </TransitionChild>

            <div class="fixed inset-0 overflow-y-auto">
                <div class="flex min-h-full items-center justify-center p-4">
                    <TransitionChild
                        enter="duration-300 ease-out"
                        enter-from="opacity-0 scale-95"
                        enter-to="opacity-100 scale-100"
                        leave="duration-200 ease-in"
                        leave-from="opacity-100 scale-100"
                        leave-to="opacity-0 scale-95"
                        as="template"
                    >
                        <DialogPanel
                            class="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all"
                        >
                            <DialogTitle
                                as="h3"
                                class="text-lg font-medium text-gray-900 mb-4"
                            >
                                Record New Sale
                            </DialogTitle>

                            <form
                                @submit.prevent="handleSaleSubmit"
                                class="space-y-4"
                            >
                                <!-- Category Filter -->
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Category</label>
                                    <select
                                        v-model="selectedCategory"
                                        @change="filterItemsByCategory"
                                        class="mt-1 block w-full rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 p-2"
                                    >
                                        <option value="">All Categories</option>
                                        <option
                                            v-for="category in categories"
                                            :key="category"
                                            :value="category"
                                        >
                                            {{ category }}
                                        </option>
                                    </select>
                                </div>

                                <!-- Item Dropdown -->
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Item</label>
                                    <select
                                        v-model="saleForm.itemId"
                                        required
                                        class="mt-1 block w-full rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 p-2"
                                    >
                                        <option value="">Select Item</option>
                                        <option
                                            v-for="item in filteredItems"
                                            :key="item._id"
                                            :value="item._id"
                                        >
                                            {{ item.name }} - Stock: {{ item.quantity }} - {{ formatPrice(item.price) }}
                                        </option>
                                    </select>
                                </div>

                                <!-- Quantity -->
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Quantity</label>
                                    <input
                                        type="number"
                                        v-model.number="saleForm.quantity"
                                        required
                                        min="1"
                                        :max="selectedItem?.quantity || 1"
                                        class="mt-1 block w-full rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 p-2"
                                    />
                                    <p v-if="selectedItem" class="mt-1 text-sm text-gray-500">
                                        Available: {{ selectedItem.quantity }}
                                    </p>
                                </div>

                                <!-- Customer Name -->
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Customer Name</label>
                                    <input
                                        type="text"
                                        v-model="saleForm.customerName"
                                        required
                                        class="mt-1 block w-full rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 p-2"
                                    />
                                </div>

                                <!-- Customer Contact -->
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Customer Contact</label>
                                    <input
                                        type="text"
                                        v-model="saleForm.customerContact"
                                        class="mt-1 block w-full rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 p-2"
                                    />
                                </div>

                                <!-- Total Amount -->
                                <div class="mt-6 border-t pt-4">
                                    <div class="flex justify-between text-sm">
                                        <span class="font-medium text-gray-700">Total Amount:</span>
                                        <span class="font-bold text-gray-900">
                                            {{ calculateTotal }}
                                        </span>
                                    </div>
                                </div>

                                <!-- Action Buttons -->
                                <div class="mt-6 flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        @click="closeNewSaleModal"
                                        class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
                                    >
                                        Complete Sale
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
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue';
import { BellIcon, UserIcon, ChevronDownIcon } from '@heroicons/vue/outline';
// State
const isSidebarOpen = ref(false);
const isUserMenuOpen = ref(false);
const showSaleModal = ref(false);
const userName = ref('');
const router = useRouter();
const authStore = useAuthStore();
const searchQuery = ref('');
const availableItems = ref([]);
const recentSales = ref([]);
const sales = ref([]);
const selectedCategory = ref("");
const saleForm = ref({
    itemId: '',
    quantity: 1,
    customerName: '',
    customerContact: ''
});
const categories = ['electronics', 'clothing', 'furniture', 'books', 'other'];
const currentPage = ref(1);
const itemsPerPage = ref(4);
// Computed Properties
const selectedItem = computed(() =>
    availableItems.value.find(item => item._id === saleForm.value.itemId)
);
const userMenuItems = [
    { name: 'Logout', action: 'logout' },
];
const calculateTotal = computed(() => {
    if (!selectedItem.value) return formatPrice(0);
    return formatPrice(selectedItem.value.price * saleForm.value.quantity);
});
const filterItemsByCategory = () => {
    saleForm.value.itemId = ""; // Reset item selection when changing categories
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
const handleClickOutside = (event) => {
    if (userMenuContainer.value && !userMenuContainer.value.contains(event.target)) {
        isUserMenuOpen.value = false;
    }
};
// Computed Properties
const filteredItems = computed(() =>
    selectedCategory.value
        ? availableItems.value.filter(
              (item) => item.category === selectedCategory.value
          )
        : availableItems.value
);

const filteredSales = computed(() => {
    if (!searchQuery.value) return recentSales.value;

    const query = searchQuery.value.toLowerCase();
    return recentSales.value.filter(sale =>
        sale.item.name.toLowerCase().includes(query) ||
        sale.customerName.toLowerCase().includes(query)
    );
});

const todayStats = computed(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaySales = recentSales.value.filter(sale =>
        new Date(sale.saleDate) >= today
    );

    return {
        sales: todaySales.reduce((sum, sale) => sum + sale.totalAmount, 0),
        transactions: todaySales.length
    };
});

const monthlyStats = computed(() => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

    const monthlySales = recentSales.value.filter(sale =>
        new Date(sale.saleDate) >= firstDay
    );

    return {
        sales: monthlySales.reduce((sum, sale) => sum + sale.totalAmount, 0),
        transactions: monthlySales.length
    };
});
const totalPages = computed(() => Math.ceil(sales.value.length / itemsPerPage.value));
const paginatedSales = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    return sales.value.slice(start, start + itemsPerPage.value);
});
// Methods
const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
};

const toggleUserMenu = () => {
    isUserMenuOpen.value = !isUserMenuOpen.value;
};

const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(price);
};

const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const fetchItems = async () => {
    try {
        const response = await axios.get('https://inventory-backend-sepia.vercel.app/api/items', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        availableItems.value = response.data;
    } catch (error) {
        console.error('Error fetching items:', error);
    }
};
const fetchRecentSales = async () => {
    try {
        const response = await axios.get('https://inventory-backend-sepia.vercel.app/api/sales/salesperson', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        console.log('API Response:', response.data); // Log the response
        recentSales.value = response.data;
    } catch (error) {
        console.error('Error fetching recent sales:', error);
    }
};

const fetchSales = async () => {
    try {
        const response = await axios.get('https://inventory-backend-sepia.vercel.app/api/sales/performance', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        recentSales.value = response.data.sales || [];
    } catch (error) {
        console.error('Error fetching sales:', error);
    }
};

const handleSaleSubmit = async () => {
    try {
        const response = await axios.post('https://inventory-backend-sepia.vercel.app/api/sales', saleForm.value, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });

        await fetchSales();
        await fetchItems();
        await fetchRecentSales();
        closeNewSaleModal();
    } catch (error) {
        console.error('Error creating sale:', error);
        alert(error.response?.data?.message || 'Error creating sale');
    }
};

const openNewSaleModal = () => {
    saleForm.value = {
        itemId: '',
        quantity: 1,
        customerName: '',
        customerContact: ''
    };
    showSaleModal.value = true;
};

const closeNewSaleModal = () => {
    showSaleModal.value = false;
};

const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    window.location.href = '/login';
};
const prevPage = () => {
    if (currentPage.value > 1) currentPage.value--;
};

const nextPage = () => {
    if (currentPage.value < totalPages.value) currentPage.value++;
};
// Lifecycle Hooks
onMounted(async () => {
    await fetchItems();
    await fetchSales();
    fetchRecentSales();
    const userData = localStorage.getItem('userData');
    if (userData) {
        const parsedData = JSON.parse(userData);
        userName.value = parsedData.name;
    }
});
</script>
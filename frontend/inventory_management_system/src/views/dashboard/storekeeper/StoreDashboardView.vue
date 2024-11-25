<template>
  <div class="flex h-screen bg-gray-50">
    <!-- Sidebar -->
    <Sidebar 
      :isOpen="isSidebarOpen" 
      @close="isSidebarOpen = false" 
    />

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Top Navigation -->
      <TopNav 
        :userName="userName"
        class="z-10"
      />

      <!-- Content -->
      <main class="flex-1 overflow-y-auto p-4 lg:p-6">
        <!-- Control Bar -->
        <ControlBar 
          @search="handleSearch"
          @filter="applyFilter"
          @sort="applySort"
        />

        <!-- Stats Section -->
        <section class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <StatCard 
            title="Total Items" 
            :value="stats.totalItems" 
            :trend="stats.itemTrend" 
            subtitle="Compared to last week"
          />
          <StatCard 
            title="Revenue" 
            :value="stats.revenue" 
            :trend="stats.revenueTrend" 
            subtitle="Compared to last month"
            format="currency"
          />
          <StatCard 
            title="Low Stock" 
            :value="stats.lowStock" 
            :trend="stats.lowStockTrend" 
            subtitle="Items below threshold"
          />
        </section>

        <!-- Item Cards Section -->
        <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          <ItemCard 
            v-for="item in filteredItems" 
            :key="item._id" 
            :item="item" 
            @edit="openEditModal(item)"
            @delete="deleteItem"
          />
        </section>
      </main>
    </div>

    <!-- Item Modal -->
    <ItemModal 
      :isOpen="isModalOpen" 
      :item="selectedItem"
      :loading="isSaving"
      @update:isOpen="isModalOpen = $event" 
      @save="saveItem"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import Sidebar from '@/components/dashboard/storekeeper/Sidebar.vue';
import TopNav from '@/components/dashboard/storekeeper/TopNav.vue';
import ControlBar from '@/components/dashboard/storekeeper/ControlBar.vue';
import StatCard from '@/components/dashboard/storekeeper/StatsCard.vue';
import ItemCard from '@/components/dashboard/storekeeper/ItemCard.vue';
import ItemModal from '@/components/dashboard/storekeeper/ItemModal.vue';
import { useItemsStore } from '@/stores/items';
import { useAuthStore } from '@/stores/auth';

const itemsStore = useItemsStore();
const authStore = useAuthStore();

// States
const isSidebarOpen = ref(true);
const isModalOpen = ref(false);
const isSaving = ref(false);
const selectedItem = ref(null);
const userName = computed(() => authStore.userName || 'User');

// Stats Data
const stats = computed(() => ({
  totalItems: itemsStore.totalItems,
  revenue: itemsStore.revenue,
  lowStock: itemsStore.lowStock,
  itemTrend: itemsStore.itemTrend,
  revenueTrend: itemsStore.revenueTrend,
  lowStockTrend: itemsStore.lowStockTrend
}));

// Inventory Data
const filteredItems = computed(() => itemsStore.filteredItems);

// Methods
const handleSearch = (query) => itemsStore.searchItems(query);
const applyFilter = (filter) => itemsStore.filterItems(filter);
const applySort = (sortBy) => itemsStore.sortItems(sortBy);

const openEditModal = (item) => {
  selectedItem.value = item;
  isModalOpen.value = true;
};

const deleteItem = async (itemId) => {
  await itemsStore.deleteItem(itemId);
};

const saveItem = async (item) => {
  isSaving.value = true;
  if (item._id) {
    await itemsStore.updateItem(item);
  } else {
    await itemsStore.addItem(item);
  }
  isSaving.value = false;
  isModalOpen.value = false;
};

// Fetch data on mount
onMounted(() => {
  itemsStore.fetchItems();
});
</script>


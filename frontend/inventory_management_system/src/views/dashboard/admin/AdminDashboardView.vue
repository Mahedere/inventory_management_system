<template>
  <StoreDashboardLayout>
    <!-- Stats Grid -->
    <div class="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
      <StatsCard
        v-for="stat in dashboardStats"
        :key="stat.title"
        v-bind="stat"
      />
    </div>

    <!-- New Users Section -->
    <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-medium text-gray-900">New User Registrations</h2>
        <div class="flex space-x-2">
          <span 
            :class="[
              'px-3 py-1 rounded-full text-sm',
              guestUsers.length > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
            ]"
          >
            {{ guestUsers.length }} Pending
          </span>
        </div>
      </div>

      <!-- Users Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="user in guestUsers" :key="user._id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">{{ user.email }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(user.createdAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <select
                  v-model="user.selectedRole"
                  class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Select Role</option>
                  <option value="storekeeper">Storekeeper</option>
                  <option value="salesperson">Salesperson</option>
                </select>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  @click="assignRole(user)"
                  :disabled="!user.selectedRole"
                  class="text-indigo-600 hover:text-indigo-900 disabled:text-gray-400 disabled:cursor-not-allowed ml-4"
                >
                  Assign Role
                </button>
              </td>
            </tr>
            <tr v-if="guestUsers.length === 0">
              <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">
                No guest user registrations
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- All Users Section -->
    <div class="bg-white rounded-lg shadow-sm p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-medium text-gray-900">All Users</h2>
        <div class="flex items-center space-x-4">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search users..."
            class="px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          >
          <select
            v-model="roleFilter"
            class="px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Roles</option>
            <option value="storekeeper">Storekeeper</option>
            <option value="salesperson">Salesperson</option>
          </select>
        </div>
      </div>

      <!-- All Users Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="user in filteredUsers" :key="user._id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">{{ user.email }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="{
                    'bg-green-100 text-green-800': user.role === 'storekeeper',
                    'bg-blue-100 text-blue-800': user.role === 'salesperson'
                  }"
                >
                  {{ user.role }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                >
                  {{ user.isActive ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  @click="toggleUserStatus(user)"
                  class="text-indigo-600 hover:text-indigo-900"
                >
                  {{ user.isActive ? 'Deactivate' : 'Activate' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </StoreDashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '@/stores/users';

const userStore = useUserStore();
const searchQuery = ref('');
const roleFilter = ref('');

const dashboardStats = computed(() => [
  {
    title: 'Total Users',
    value: userStore.totalUsers,
    trend: 8,
    subtitle: 'Active users'
  },
  {
    title: 'New Registrations',
    value: userStore.guestUsers.length,
    trend: 12,
    subtitle: 'This week'
  },
  {
    title: 'Storekeepers',
    value: userStore.storekeepersCount,
    trend: 5,
    subtitle: 'Active storekeepers'
  },
  {
    title: 'Salespersons',
    value: userStore.salespersonsCount,
    trend: 3,
    subtitle: 'Active salespersons'
  }
]);

const guestUsers = computed(() => userStore.guestUsers);

const filteredUsers = computed(() => {
  let users = userStore.assignedUsers;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    users = users.filter(user => 
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    );
  }

  if (roleFilter.value) {
    users = users.filter(user => user.role === roleFilter.value);
  }

  return users;
});

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const assignRole = async (user) => {
  try {
    await userStore.assignRole(user._id, user.selectedRole);
  } catch (error) {
    console.error('Error assigning role:', error);
  }
};

const toggleUserStatus = async (user) => {
  try {
    await userStore.toggleUserStatus(user._id);
  } catch (error) {
    console.error('Error toggling user status:', error);
  }
};

onMounted(async () => {
  await userStore.fetchUsers();
});
</script>
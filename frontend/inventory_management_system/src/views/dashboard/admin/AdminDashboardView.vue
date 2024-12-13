<template>
  <StoreDashboardLayout>
    <!-- Top Navigation -->
    <TopNav :userName="userName" class="z-10" />
    <section class="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="stat in dashboardStats" :key="stat.title" class="p-4 border rounded-lg shadow-sm bg-white">
          <h3 class="text-sm font-medium text-gray-500">{{ stat.title }}</h3>
          <p class="text-3xl font-bold text-indigo-600">{{ stat.value }}</p>
          <p class="text-sm text-gray-500">{{ stat.subtitle }}</p>
          <span :class="[
            'mt-2 inline-flex items-center px-2 py-1 rounded text-xs font-medium',
            stat.trend > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800',
          ]">
            {{ stat.trend > 0 ? '+' : '' }}{{ stat.trend }}% this week
          </span>
        </div>
      </div>
    </section>
    <!-- New Users Section -->
    <section class="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
      <header class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-medium text-gray-900">New User Registrations</h2>
        <span :class="[
          'px-3 py-1 rounded-full text-sm',
          guestUsers.length > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800',
        ]">
          {{ guestUsers.length }} Pending
        </span>
      </header>

      <!-- Users Table -->
      <div>
        <div v-if="guestUsers.length === 0" class="text-center text-gray-500">
          No guest user registrations
        </div>
        <!-- Table for larger screens -->
        <table v-if="guestUsers.length > 0" class="hidden sm:table min-w-full divide-y divide-gray-200 text-sm">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-2 text-left font-medium text-gray-600">Name</th>
              <th class="py-2 text-left font-medium text-gray-600">Email</th>
              <th class="px-2 py-2 text-left font-medium text-gray-600">Date</th>
              <th class="px-2 py-2 text-left font-medium text-gray-600">Role</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="user in guestUsers" :key="user._id">
              <td class="px-4 py-3 font-medium text-gray-900">{{ user.name }}</td>
              <td class="py-2 text-gray-500">{{ user.email }}</td>
              <td class="py-2 text-gray-500">{{ formatDate(user.createdAt) }}</td>
              <td class="py-2">
                <select placeholder="Select Role" v-model="user.selectedRole" @change="assignRole(user)"
                  class="w-full px-3 py-2 border rounded-md focus:ring focus:ring-indigo-300">
                  <option value="storekeeper">Storekeeper</option>
                  <option value="salesperson">Salesperson</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Stacked card design for mobile -->
        <div class="block sm:hidden space-y-4">
          <div v-for="user in guestUsers" :key="user._id" class="p-4 border rounded-lg bg-white shadow-sm">
            <div class="mb-2">
              <span class="text-gray-500 text-sm">Name:</span>
              <p class="text-gray-900 font-medium">{{ user.name }}</p>
            </div>
            <div class="mb-2">
              <span class="text-gray-500 text-sm">Email:</span>
              <p class="text-gray-700">{{ user.email }}</p>
            </div>
            <div class="mb-2">
              <span class="text-gray-500 text-sm">Date:</span>
              <p class="text-gray-700">{{ formatDate(user.createdAt) }}</p>
            </div>
            <div>
              <span class="text-gray-500 text-sm">Role:</span>
              <select v-model="user.selectedRole" @change="assignRole(user)"
                class="w-full mt-1 px-3 py-2 border rounded-md focus:ring focus:ring-indigo-300">
                <option value="storekeeper">Storekeeper</option>
                <option value="salesperson">Salesperson</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- All Users Section -->
    <section class="bg-white rounded-lg shadow-sm p-4 sm:p-6">
      <header class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-4 sm:space-y-0">
        <h2 class="text-lg font-medium text-gray-900">All Users</h2>
        <div class="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0">
          <input v-model="searchQuery" type="text" placeholder="Search users..."
            class="w-full sm:w-auto px-4 py-2 border rounded-md focus:ring focus:ring-indigo-300" />
          <select v-model="roleFilter" class="px-4 py-2 border rounded-md focus:ring focus:ring-indigo-300">
            <option value="">All Roles</option>
            <option value="storekeeper">Storekeeper</option>
            <option value="salesperson">Salesperson</option>
          </select>
        </div>
      </header>

      <!-- Users List -->
      <div>
        <!-- Table for larger screens -->
        <table v-if="paginatedUsers.length > 0" class="hidden sm:table min-w-full divide-y divide-gray-200 text-sm">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-2 text-left font-medium text-gray-600">Name</th>
              <th class="px-4 py-2 text-left font-medium text-gray-600">Email</th>
              <th class="px-4 py-2 text-left font-medium text-gray-600">Role</th>
              <th class="px-4 py-2 text-right font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="user in paginatedUsers" :key="user._id">
              <td class="px-4 py-3 font-medium text-gray-900">{{ user.name }}</td>
              <td class="px-4 py-3 font-medium text-gray-600">{{ user.email }}</td>
              <td class="px-4 py-3">
                <span class="px-2 py-1 inline-flex text-xs font-semibold rounded-full" :class="{
                  'bg-green-100 text-green-800': user.role === 'storekeeper',
                  'bg-blue-100 text-blue-800': user.role === 'salesperson',
                }">
                  {{ user.role }}
                </span>
              </td>
              <td class="px-4 py-3 text-right">
                <button @click="toggleUserStatus(user)" class="text-indigo-600 hover:underline">
                  {{ user.isActive ? 'Deactivate' : 'Activate' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Card design for mobile -->
        <div v-else class="text-center text-gray-500">No users found</div>
        <div class="block sm:hidden space-y-4">
          <div v-for="user in paginatedUsers" :key="user._id" class="border rounded-lg bg-white shadow-sm">
            <div class="mb-2">
              <span class="text-gray-500 text-sm">Email:</span>
              <p class="text-gray-900 font-medium">{{ user.email }}</p>
            </div>
            <div class="mb-2">
              <span class="text-gray-500 text-sm">Role:</span>
              <p class="text-gray-700">{{ user.role }}</p>
            </div>
            <div>
              <button @click="toggleUserStatus(user)" class="text-indigo-600 hover:underline">
                {{ user.isActive ? 'Deactivate' : 'Activate' }}
              </button>
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
        <span class="text-sm text-gray-700"> Page {{ currentPage }} of {{ totalPages }} </span>
        <button @click="goToPage(currentPage + 1)" :disabled="currentPage >= totalPages"
          class="px-4 py-2 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-gray-300">
          Next
        </button>
      </div>
    </section>
    <div v-if="showConfirmDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
  <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
    <h3 class="text-lg font-medium text-gray-900 mb-4">Confirm Role Assignment</h3>
    <p class="text-gray-600 mb-6">
      Are you sure you want to assign {{ selectedUser?.name }} as a {{ pendingRole }}?
    </p>
    <div class="flex justify-end space-x-4">
      <button
        @click="showConfirmDialog = false"
        class="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
      >
        Cancel
      </button>
      <button
        @click="confirmAssignRole"
        class="px-4 py-2 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
      >
        Confirm
      </button>
    </div>
  </div>
</div>
  </StoreDashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/users'
import TopNav from '@/components/dashboard/admin/TopNav.vue'

const userStore = useUserStore()

// State variables
const searchQuery = ref('')
const roleFilter = ref('')
const currentPage = ref(1)
const usersPerPage = 4
const showConfirmDialog = ref(false)
const selectedUser = ref(null)
const pendingRole = ref('')

// Dashboard stats
const dashboardStats = computed(() => [
  {
    title: 'Total Users',
    value: userStore.totalUsers,
    trend: 8,
    subtitle: 'Active users',
  },
  {
    title: 'New Registrations',
    value: userStore.guestUsers.length,
    trend: 12,
    subtitle: 'This week',
  },
  {
    title: 'Storekeepers',
    value: userStore.storekeepersCount,
    trend: 5,
    subtitle: 'Active storekeepers',
  },
  {
    title: 'Salespersons',
    value: userStore.salespersonsCount,
    trend: 3,
    subtitle: 'Active salespersons',
  },
])

// Computed properties for user filtering and pagination
const guestUsers = computed(() => userStore.guestUsers)

const filteredUsers = computed(() => {
  let users = userStore.assignedUsers

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    users = users.filter(
      (user) => user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query),
    )
  }

  if (roleFilter.value) {
    users = users.filter((user) => user.role === roleFilter.value)
  }

  return users
})

const totalPages = computed(() => Math.ceil(filteredUsers.value.length / usersPerPage))
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * usersPerPage
  return filteredUsers.value.slice(start, start + usersPerPage)
})

// Utility function
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// Methods
const assignRole = (user) => {
  // Set selected user and pending role
  selectedUser.value = user
  pendingRole.value = user.selectedRole
  showConfirmDialog.value = true
}

const confirmAssignRole = async () => {
  try {
    if (selectedUser.value && pendingRole.value) {
      // Assign role through the store
      await userStore.assignRole(selectedUser.value._id, pendingRole.value)
      showConfirmDialog.value = false
      selectedUser.value = null
      pendingRole.value = ''
    }
  } catch (error) {
    console.error('Error assigning role:', error)
  }
}

const toggleUserStatus = async (user) => {
  try {
    await userStore.toggleUserStatus(user._id)
  } catch (error) {
    console.error('Error toggling user status:', error)
  }
}

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

onMounted(async () => {
  await userStore.fetchUsers()
})
</script>

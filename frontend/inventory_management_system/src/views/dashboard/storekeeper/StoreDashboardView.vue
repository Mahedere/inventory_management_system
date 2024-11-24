<template>
  <div class="flex h-screen">
    <!-- Sidebar Navigation -->
    <div class="fixed inset-y-0 left-0 lg:relative lg:w-64 bg-white shadow-lg z-40"
         :class="{ '-translate-x-full': !isSidebarOpen, 'translate-x-0': isSidebarOpen }">
      <div class="flex items-center p-4 border-b">
        <div class="text-xl font-bold text-indigo-600">Inventory</div>
        <button @click="toggleSidebar" class="ml-auto lg:hidden p-2">
          <svg class="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <nav class="p-4 space-y-2">
        <router-link to="/dashboard" class="flex items-center p-3 text-indigo-600 bg-indigo-50 rounded-lg">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z">
            </path>
          </svg>
          <span class="ml-2">Dashboard</span>
        </router-link>

        <router-link to="/inventory" class="flex items-center p-3 text-gray-600 hover:bg-gray-50 rounded-lg">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4">
            </path>
          </svg>
          <span class="ml-2">Inventory</span>
        </router-link>

        <router-link to="/sales" class="flex items-center p-3 text-gray-600 hover:bg-gray-50 rounded-lg">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2">
            </path>
          </svg>
          <span class="ml-2">Sales</span>
        </router-link>
      </nav>
    </div>
<!-- Main Content Area -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Top Navigation Bar -->
      <header class="bg-white border-b px-4 lg:px-6 py-4">
        <div class="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
          <div class="flex-1 ml-12 lg:ml-0">
            <h1 class="text-xl font-semibold text-gray-900 lg:text-2xl">Morning, {{ userName }}!</h1>
            <p class="text-sm text-gray-500">Here's what's happening with your store today.</p>
          </div>

          <!-- User Menu -->
          <div class="flex ml-15 flex-col items-start space-y-4 lg:flex-row lg:items-center lg:space-y-0 lg:space-x-4">
            <div class="flex items-center space-x-4">
              <button class="p-2 text-gray-400 hover:text-gray-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9">
                  </path>
                </svg>
              </button>

              <div class="relative" ref="userMenuContainer">
                <button class="flex items-center space-x-2" @click="toggleUserMenu">
                  <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z">
                      </path>
                    </svg>
                  </div>
                </button>

                <div v-if="isUserMenuOpen"
                     class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                  <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
                  <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
                  <a @click="handleLogout" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                    Logout
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="flex-1 overflow-y-auto p-4 lg:p-6">
        <!-- Stats Grid -->
        <div class="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          <StatsCard
            v-for="stat in dashboardStats"
            :key="stat.title"
            :title="stat.title"
            :value="stat.value"
            :change="stat.change"
            :subtitle="stat.subtitle"
          />
        </div>

        <!-- Content will continue in the next update -->
      </main>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StoreDashboardView',

  data() {
    return {
      isSidebarOpen: false,
      isUserMenuOpen: false,
      userName: 'User',
      dashboardStats: [
        {
          title: 'Total Items',
          value: '0',
          change: { value: '12%', type: 'increase' },
          subtitle: 'From last month'
        },
        {
          title: 'Low Stock Items',
          value: '0',
          change: { value: '2%', type: 'decrease' },
          subtitle: 'Needs attention'
        },
        {
          title: 'Total Categories',
          value: '0',
          change: { value: '5%', type: 'increase' },
          subtitle: 'Active categories'
        },
        {
          title: 'Total Value',
          value: '$0',
          change: { value: '8%', type: 'increase' },
          subtitle: 'Inventory worth'
        }
      ]
    }
  },
methods: {
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen
    },

    toggleUserMenu() {
      this.isUserMenuOpen = !this.isUserMenuOpen
    },

    handleLogout() {
      // Implement logout logic
      this.$router.push('/login')
    },

    // Add more methods as needed
  },

  mounted() {
    // Load user data and initial stats
    // This would typically involve API calls
    const userData = localStorage.getItem('userData')
    if (userData) {
      try {
        const parsedUserData = JSON.parse(userData)
        this.userName = parsedUserData.name
      } catch (e) {
        console.error('Error parsing user data:', e)
      }
    }
  }
}
</script>

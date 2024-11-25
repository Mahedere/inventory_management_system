import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/auth/RegisterView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/registration-success',
      name: 'registration-success',
      component: () => import('@/views/auth/RegistrationSuccessView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/LoginView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('@/views/auth/ForgotPasswordView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/store-dashboard',
      name: 'dashboard',
      component: () => import('@/views/dashboard/storekeeper/StoreDashboardView.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
    // Allow access to registration success page if coming from register page
    if (to.name === 'registration-success' && from.name === 'register') {
      next()
      return
    }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  // } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
  //   next('/dashboard')
  } else {
    next()
  }
})

export default router

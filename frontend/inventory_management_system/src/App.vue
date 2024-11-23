`<template>
  <div id="app">
    <!-- Layout Selection Based on Route -->
    <template v-if="isAuthRoute">
      <AuthLayout>
        <RouterView />
      </AuthLayout>
    </template>
    <template v-else>
      <RouterView />
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import AuthLayout from '@/layouts/AuthLayout.vue'

const route = useRoute()

// Compute whether current route is an auth route
const isAuthRoute = computed(() => {
  return [
    '/login',
    '/register',
    '/forgot-password',
    '/registration-success'
  ].includes(route.path)
})
</script>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;

html {
  @apply antialiased;
}

#app {
  @apply min-h-screen bg-gray-50;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>`

`<template>
  <div class="max-w-md w-full space-y-8 bg-white shadow-md rounded-md p-6 md:p-8">
    <div class="text-center">
      <!-- Success Icon -->
      <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
        <svg class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <!-- Title -->
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Registration Successful!
      </h2>

      <!-- Message -->
      <div class="mt-4 text-center">
        <p class="text-sm text-gray-600">
          Thank you for registering with our Inventory Management System.
        </p>
        <p class="mt-2 text-sm text-gray-600">
          Your account is currently under review. You will receive an email once your account has been approved.
        </p>
        <p class="mt-2 text-sm text-gray-600">
          Please check your email at <span class="font-medium text-indigo-600">{{ email }}</span>
        </p>
      </div>

      <!-- Additional Instructions -->
      <div class="mt-6 space-y-2 text-sm text-gray-500">
        <p>What happens next?</p>
        <ul class="list-disc list-inside space-y-1 text-left">
          <li>Our team will review your registration</li>
          <li>You'll receive an approval email within 24-48 hours</li>
          <li>Once approved, you can log in to your account</li>
        </ul>
      </div>

      <!-- Back to Login Button -->
      <div class="mt-6">
        <router-link
          to="/login"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Back to Login
        </router-link>
      </div>

      <!-- Contact Support -->
      <div class="mt-4 text-sm text-gray-500">
        Need help? Contact support at
        <a href="mailto:support@gmail.com" class="text-indigo-600 hover:text-indigo-500">
          support@gmail.com
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const email = authStore.user?.email || 'your registered email';

onMounted(() => {
  // If no user data is present, redirect to register
  if (!authStore.user) {
    router.replace('/register');
  }
});
</script>`

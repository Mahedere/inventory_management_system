<template>
  <div class="max-w-md w-full space-y-8 bg-white shadow-md rounded-md p-6 md:p-8">
    <div>
      <h2 class="text-center text-3xl font-extrabold text-gray-900">
        Sign in to your account
      </h2>
    </div>
    <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
      <!-- Email Field -->
      <div>
        <label for="email" class="sr-only">Email address</label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          required
          class="input-field w-full rounded-md p-3 border border-indigo-600 focus:ring-indigo-500 focus:border-indigo-600"
          :class="{ 'border-red-500': errors.email }"
          placeholder="Email address"
        >
        <span v-if="errors.email" class="text-red-500 text-sm">{{ errors.email }}</span>
      </div>

      <!-- Password Field -->
<div class="relative">
  <label for="password" class="sr-only">Password</label>
  <input
    id="password"
    v-model="form.password"
    :type="showPassword ? 'text' : 'password'"
    required
    class="input-field w-full rounded-md p-3 border border-indigo-600 focus:ring-indigo-500 focus:border-indigo-600"
    :class="{ 'border-red-500': errors.password }"
    placeholder="Password"
  >
  <button
    type="button"
    @click="showPassword = !showPassword"
    class="absolute right-3 top-1/2 transform -translate-y-1/2 text-indigo-500"
    aria-label="Toggle password visibility"
  >
    <!-- Eye Icon (Password Visible) -->
    <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M1 12C2.732 7.943 7.02 5 12 5s9.268 2.943 11 7c-1.732 4.057-6.02 7-11 7s-9.268-2.943-11-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>

    <!-- Eye Slash Icon (Password Hidden) -->
    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M1 12C2.732 7.943 7.02 5 12 5s9.268 2.943 11 7c-1.732 4.057-6.02 7-11 7s-9.268-2.943-11-7z" />
      <path d="M3.515 3.515l17 17M9.172 9.172A3.001 3.001 0 0112 9c1.657 0 3 1.343 3 3 0 .828-.336 1.578-.88 2.121m-.948.947a2.999 2.999 0 01-4.24-4.24" />
    </svg>
  </button>
  <span v-if="errors.password" class="text-red-500 text-sm">{{ errors.password }}</span>
</div>


      <!-- Remember Me and Forgot Password -->
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <input
            id="remember-me"
            v-model="form.rememberMe"
            type="checkbox"
            class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          >
          <label for="remember-me" class="ml-2 block text-sm text-gray-900">
            Remember me
          </label>
        </div>

        <div class="text-sm">
          <router-link to="/forgot-password" class="font-medium text-indigo-600 hover:text-indigo-500">
            Forgot your password?
          </router-link>
        </div>
      </div>

      <!-- Submit Button -->
      <div>
        <button
          type="submit"
          :disabled="authStore.loading"
          class="w-full flex justify-center p-3 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
        >
          <span v-if="!authStore.loading">Sign in</span>
          <span v-else class="flex items-center">
            <svg class="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            Processing...
          </span>
        </button>
      </div>

      <!-- Error Message -->
      <div v-if="authStore.error" class="text-red-500 text-sm text-center">
        {{ authStore.error }}
      </div>

      <!-- Register Link -->
      <div class="text-center">
        <router-link
          to="/register"
          class="font-medium text-indigo-600 hover:text-indigo-500 text-sm"
        >
          Don't have an account? Sign up
        </router-link>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import * as yup from 'yup';

const router = useRouter();
const authStore = useAuthStore();

const showPassword = ref(false);
const errors = reactive({});

const form = reactive({
  email: '',
  password: '',
  rememberMe: false
});
const schema = yup.object().shape({
  email: yup.string()
    .email('Please enter a valid email')
    .required('Email is required'),
  password: yup.string()
    .required('Password is required')
});

const handleSubmit = async () => {
  try {
    // Clear previous errors
    Object.keys(errors).forEach(key => delete errors[key]);

    // Validate form
    await schema.validate(form, { abortEarly: false });

    // Login user
    const success = await authStore.login({
      email: form.email,
      password: form.password
    });

    if (success) {
      // Route based on user role
      const userRole = authStore.userRole;
      if (userRole === 'admin') {
        router.push('/admin-dashboard');
      } else if (userRole === 'storekeeper') {
        router.push('/store-dashboard');
      }
       else if (userRole === 'salesperson') {
        router.push('/sales-dashboard');
      } else if (userRole === 'guest') {
        router.push('/registration-success');
    }
    }
  } catch (error) {
    if (error.inner) {
      error.inner.forEach((err) => {
        errors[err.path] = err.message;
      });
    }
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="max-w-md w-full space-y-8 bg-white shadow-md rounded-md p-6 md:p-8">
      <div>
        <h2 class="text-center text-3xl font-extrabold text-gray-900">
          Reset your password
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Enter your email address and we'll send you a link to reset your password.
        </p>
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

        <!-- Submit Button -->
        <div>
          <button
            type="submit"
            :disabled="authStore.loading"
            class="w-full flex justify-center p-3 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
          >
            <span v-if="!authStore.loading">Send Reset Link</span>
            <span v-else class="flex items-center">
              <svg class="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              Sending...
            </span>
          </button>
        </div>

        <!-- Success Message -->
        <div v-if="successMessage" class="text-green-500 text-sm text-center">
          {{ successMessage }}
        </div>

        <!-- Error Message -->
        <div v-if="authStore.error" class="text-red-500 text-sm text-center">
          {{ authStore.error }}
        </div>

        <!-- Back to Login -->
        <div class="text-center">
          <router-link
            to="/login"
            class="font-medium text-indigo-600 hover:text-indigo-500 text-sm"
          >
            Back to sign in
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useAuthStore } from '@/stores/auth';
import * as yup from 'yup';

const authStore = useAuthStore();
const errors = reactive({});
const successMessage = ref('');

const form = reactive({
  email: ''
});

const schema = yup.object().shape({
  email: yup.string()
    .email('Please enter a valid email')
    .required('Email is required')
});

const handleSubmit = async () => {
  try {
    // Clear previous errors and success message
    Object.keys(errors).forEach(key => delete errors[key]);
    successMessage.value = '';

    // Validate form
    await schema.validate(form, { abortEarly: false });

    // Send reset password email
    const success = await authStore.forgotPassword(form.email);

    if (success) {
      successMessage.value = 'Password reset instructions have been sent to your email.';
      form.email = ''; // Clear the form
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

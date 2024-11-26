<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div class="space-y-6">
      <!-- Name Field -->
      <div>
        <label for="name" class="sr-only">Name</label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          class="input-field w-full rounded-md p-3 border border-indigo-600 focus:ring-indigo-500 focus:border-indigo-600"
          :class="{ 'border-red-500': errors.name }"
          placeholder="Full Name"
        />
        <span v-if="errors.name" class="text-red-500 text-sm">{{ errors.name }}</span>
      </div>

      <!-- Email Field -->
      <div>
        <label for="email" class="sr-only">Email address</label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          class="input-field w-full rounded-md p-3 border border-indigo-600 focus:ring-indigo-500 focus:border-indigo-600"
          :class="{ 'border-red-500': errors.email }"
          placeholder="Email address"
        />
        <span v-if="errors.email" class="text-red-500 text-sm">{{ errors.email }}</span>
      </div>

      <!-- Password Field -->
      <div class="relative">
        <label for="password" class="sr-only">Password</label>
        <input
          id="password"
          v-model="form.password"
          :type="showPassword ? 'text' : 'password'"
          class="input-field w-full rounded-md p-3 border border-indigo-600 focus:ring-indigo-500 focus:border-indigo-600"
          :class="{ 'border-red-500': errors.password }"
          placeholder="Password"
        />
        <button
          type="button"
          @click="togglePasswordVisibility"
          class="absolute right-3 top-1/2 transform -translate-y-1/2"
        >
          <span v-if="showPassword">🙈</span>
          <span v-else>👁</span>
        </button>
        <span v-if="errors.password" class="text-red-500 text-sm">{{ errors.password }}</span>
      </div>

      <!-- Confirm Password Field -->
      <div class="relative">
        <label for="confirm-password" class="sr-only">Confirm Password</label>
        <input
          id="confirm-password"
          v-model="form.confirmPassword"
          :type="showConfirmPassword ? 'text' : 'password'"
          class="input-field w-full rounded-md p-3 border border-indigo-600 focus:ring-indigo-500 focus:border-indigo-600"
          :class="{ 'border-red-500': errors.confirmPassword }"
          placeholder="Confirm Password"
        />
        <button
          type="button"
          @click="toggleConfirmPasswordVisibility"
          class="absolute right-3 top-1/2 transform -translate-y-1/2"
        >
          <span v-if="showConfirmPassword">🙈</span>
          <span v-else>👁</span>
        </button>
        <span v-if="errors.confirmPassword" class="text-red-500 text-sm">{{ errors.confirmPassword }}</span>
      </div>

      <!-- Terms Checkbox -->
      <div class="flex items-center">
        <input
          id="terms"
          v-model="form.terms"
          type="checkbox"
          class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label for="terms" class="ml-2 block text-sm text-gray-900">
          I agree to the Terms and Conditions
        </label>
      </div>
      <span v-if="errors.terms" class="text-red-500 text-sm">{{ errors.terms }}</span>

      <!-- Submit Button -->
      <button
        type="submit"
        :disabled="authStore.loading"
        class="w-full flex justify-center p-3 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
      >
        <span v-if="!authStore.loading">Register</span>
        <span v-else class="flex items-center">
          <svg class="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Processing...
        </span>
      </button>

      <!-- Error Message -->
      <div v-if="authStore.error" class="text-red-500 text-sm text-center">
        {{ authStore.error }}
      </div>

      <!-- Login Link -->
      <div class="text-center">
        <router-link
          to="/login"
          class="font-medium text-indigo-600 hover:text-indigo-500 text-sm"
        >
          Already have an account? Sign in
        </router-link>
      </div>
    </div>
  </form>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import * as yup from 'yup';

const router = useRouter();
const authStore = useAuthStore();

const showPassword = ref(false);
const showConfirmPassword = ref(false);
const errors = reactive({});

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  terms: false,
  role: 'guest', // Default role
});

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
  terms: yup.boolean()
    .oneOf([true], 'You must accept the terms and conditions'),
});

const handleSubmit = async () => {
  try {
    Object.keys(errors).forEach((key) => delete errors[key]);
    await schema.validate(form, { abortEarly: false });

    const success = await authStore.register({
      name: form.name,
      email: form.email,
      password: form.password,
      role: form.role,
    });

    if (success) {
      router.push('/registration-success');
    }
  } catch (error) {
    if (error.inner) {
      error.inner.forEach((err) => {
        errors[err.path] = err.message;
      });
    }
  }
};

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const toggleConfirmPasswordVisibility = () => {
  showConfirmPassword.value = !showConfirmPassword.value;
};
</script>

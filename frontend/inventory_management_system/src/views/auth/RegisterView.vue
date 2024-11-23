<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white shadow-md rounded-md p-6 md:p-8">
      <div>
        <h2 class="text-center text-3xl font-extrabold text-gray-900">
          Create a new account
        </h2>
      </div>
      <RegisterForm />
    </div>
  </div>
</template>

<script setup>
import RegisterForm from '@/components/auth/RegisterForm.vue';
</script>

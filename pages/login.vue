<!-- pages/login.vue -->
<template>
    <div class="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div class="max-w-md w-full bg-white rounded-lg shadow-md overflow-hidden p-8">
        <h2 class="text-2xl font-bold text-center mb-6">Login to Your Account</h2>
        
        <div class="flex justify-center">
          <LoginButton />
        </div>
        
        <p class="mt-6 text-center text-gray-600">
          Login with your Google account to access your MTG Tournament Master profile.
        </p>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import LoginButton from '~/components/Auth/LoginButton.vue';
  </script>
<!-- components/Auth/LoginButton.vue -->
<template>
  <div class="flex flex-col space-y-3">
    <button 
      @click="login" 
      class="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded flex items-center"
    >
      <span class="mr-2">Login with Google</span>
    </button>
    
    <div class="flex items-center">
      <input 
        type="checkbox" 
        id="remember-me" 
        v-model="rememberMe" 
        class="h-4 w-4 text-blue-600 rounded border-gray-300"
      />
      <label for="remember-me" class="ml-2 text-sm text-gray-700">
        Remember me
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRuntimeConfig } from '#app';
import { useAuthStore } from '~/stores/auth'; // Update path as needed

const config = useRuntimeConfig();
const authStore = useAuthStore();

// Use computed property to create two-way binding with the store
const rememberMe = computed({
  get: () => authStore.rememberMe,
  set: (value) => authStore.setRememberMe(value)
});

const login = async () => {
  try {
    // Send the remember me preference to the backend before redirecting
    await fetch(`${config.public.apiBaseUrl}/auth/remember-me`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Important for session cookies
      body: JSON.stringify({ rememberMe: rememberMe.value }),
    });
    
    // Then redirect to Google OAuth
    window.location.href = `${config.public.apiBaseUrl}/auth/google`;
  } catch (error) {
    console.error('Failed to set remember me preference:', error);
    // Still redirect to login even if the preference setting fails
    window.location.href = `${config.public.apiBaseUrl}/auth/google`;
  }
};
</script>
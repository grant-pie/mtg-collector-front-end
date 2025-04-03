<!-- components/Auth/LoginButton.vue -->
<template>
  <div class="flex flex-col space-y-3">
    <button 
      @click="login" 
      :disabled="loginInProgress"
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
import { computed, ref } from 'vue';
import { useRuntimeConfig } from '#app';
import { useAuthStore } from '~/stores/auth'; // Update path as needed

const config = useRuntimeConfig();
const authStore = useAuthStore();
const loginInProgress = ref(false);

// Use computed property to create two-way binding with the store
const rememberMe = computed({
  get: () => authStore.rememberMe,
  set: (value) => authStore.setRememberMe(value)
});

const login = async () => {
  if (loginInProgress.value) return;
  
  loginInProgress.value = true;
  
  try {
    // Store preference in localStorage as a backup
    if (process.client) {
      localStorage.setItem('oauth_remember_me', rememberMe.value.toString());
    }
    
    // Simply redirect to the Google auth endpoint with the remember me parameter
    window.location.href = `${config.public.apiBaseUrl}/auth/google?remember_me=${rememberMe.value}`;
  } catch (error) {
    console.error('Error starting login flow:', error);
    // Fallback for errors
    window.location.href = `${config.public.apiBaseUrl}/auth/google?remember_me=${rememberMe.value}`;
  } finally {
    loginInProgress.value = false;
  }
};
</script>
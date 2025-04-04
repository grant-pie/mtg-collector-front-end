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
        v-model="localRememberMe" 
        class="h-4 w-4 text-blue-600 rounded border-gray-300"
      />
      <label for="remember-me" class="ml-2 text-sm text-gray-700">
        Remember me
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRuntimeConfig } from '#app';
import { useAuthStore } from '~/stores/auth'; // Direct access to store is more reliable here

const config = useRuntimeConfig();
const authStore = useAuthStore(); // Using store directly
const loginInProgress = ref(false);

// Use a local variable for the checkbox
const localRememberMe = ref(authStore.rememberMe);

// Watch for changes to update the store
watch(localRememberMe, (newValue) => {
  authStore.setRememberMe(newValue);
});

// Also make sure we're in sync with the store initially
onMounted(() => {
  localRememberMe.value = authStore.rememberMe;
});

const login = async () => {
  if (loginInProgress.value) return;
  
  loginInProgress.value = true;
  
  try {
    console.log('Sending remember me preference:', localRememberMe.value);
    
    // First, ensure remember-me preference is set in session
    await fetch(`${config.public.apiBaseUrl}/auth/remember-me`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ rememberMe: localRememberMe.value }),
    });
    
    // Then redirect to Google OAuth with the remember_me parameter
    window.location.href = `${config.public.apiBaseUrl}/auth/google?remember_me=${localRememberMe.value}`;
  } catch (error) {
    console.error('Error starting login flow:', error);
    // Fallback still includes the remember_me parameter
    window.location.href = `${config.public.apiBaseUrl}/auth/google?remember_me=${localRememberMe.value}`;
  } finally {
    loginInProgress.value = false;
  }
};
</script>
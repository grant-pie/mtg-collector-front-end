<template>
  <div class="flex justify-center items-center min-h-screen">
    <div class="text-center" v-if="loading">
      <h2 class="text-2xl font-bold mb-4">Processing login...</h2>
      <p>Please wait while we complete your authentication.</p>
    </div>
    
    <div class="text-center" v-else-if="error">
      <h2 class="text-2xl font-bold mb-4 text-red-600">Authentication Error</h2>
      <p>{{ error }}</p>
      <NuxtLink 
        to="/" 
        class="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Return to Home
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuth } from '~/composables/useAuth'; // Updated to use the composable
import { useRuntimeConfig } from '#app';
import { useAuthStore } from '~/stores/auth';

const route = useRoute();
const router = useRouter();
const auth = useAuth(); // Use the auth composable
const loading = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
  const encodedData = route.query.data;
  
  if (!encodedData || typeof encodedData !== 'string') {
    error.value = 'No authentication data provided';
    loading.value = false;
    return;
  }
  
  try {
    // Parse the encoded data
    const authResult = JSON.parse(decodeURIComponent(encodedData));
    
    console.log('Auth result:', authResult);
    
    // Check for access_token (new format) or token (old format)
    const token = authResult.access_token || authResult.token;
    if (token) {
      // Using the auth store through the composable
      // Store the token
      auth.isAuthenticated; // Access the computed property to make sure the store is initialized
      const authStore = useAuthStore(); // Get direct access to store for setting values
      
      authStore.setToken(token);
      
      // Handle the remember me flag if present
      if (authResult.rememberMe !== undefined) {
        authStore.setRememberMe(authResult.rememberMe);
        console.log('Remember me set to:', authResult.rememberMe);
      }
      
      // Handle refresh token if present
      if (authResult.refresh_token) {
        authStore.setRefreshToken(authResult.refresh_token);
        console.log('Refresh token stored');
      }
      
      // Set user data
      if (authResult.user) {
        authStore.setUser(authResult.user);
      }
      
      // Check if all data is properly stored in localStorage when "remember me" is enabled
      if (authResult.rememberMe && process.client) {
        console.log('Token in localStorage:', localStorage.getItem('token'));
        console.log('Refresh token in localStorage:', localStorage.getItem('refreshToken'));
      }
      
      // Redirect to profile page
      router.push('/profile');
    } else {
      console.error('Auth response structure:', authResult);
      error.value = 'No token received from server';
      loading.value = false;
    }
  } catch (err) {
    console.error('Auth callback error:', err);
    error.value = 'An error occurred during authentication';
    loading.value = false;
  }
});
</script>
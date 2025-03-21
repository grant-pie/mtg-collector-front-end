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
import { useAuthStore } from '~/stores/auth';
import { useRuntimeConfig } from '#app';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
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
    
    if (authResult.token) {
      // Store the token and user data
      authStore.setToken(authResult.token);
      if (authResult.user) {
        authStore.setUser(authResult.user);
      }
      
      // Redirect to profile page
      router.push('/profile');
    } else {
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
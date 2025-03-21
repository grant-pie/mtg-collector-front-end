// pages/auth/success.vue
<template>
  <div class="auth-success">
    <p>{{ message }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const message = ref('Completing authentication...');

onMounted(() => {
  // Get the data from URL
  const urlParams = new URLSearchParams(window.location.search);
  const encodedData = urlParams.get('data');
  
  if (encodedData) {
    try {
      // Decode the data
      const authData = JSON.parse(decodeURIComponent(encodedData));
      
      // Store token and user data
      localStorage.setItem('token', authData.access_token);
      localStorage.setItem('user', JSON.stringify(authData.user));
      
      // Redirect to index
      router.push('/auth/callback');
    } catch (error) {
      console.error('Error parsing auth data:', error);
      router.push({ 
        path: '/login', 
        query: { error: 'Authentication failed' } 
      });
    }
  } else {
    router.push({ 
      path: '/login', 
      query: { error: 'No authentication data received' } 
    });
  }
});
</script>

<style scoped>
.auth-success {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.2rem;
}
</style>
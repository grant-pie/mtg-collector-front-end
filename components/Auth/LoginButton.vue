<!-- components/Auth/LoginButton.vue -->
<template>
  <button 
    @click="login" 
    class="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded flex items-center"
  >
    <span class="mr-2">Login with Google</span>
  </button>
</template>

<script setup lang="ts">
import { useRuntimeConfig } from '#app';

const config = useRuntimeConfig();

const login = () => {
  window.location.href = `${config.public.apiBaseUrl}/auth/google`;
};
</script>
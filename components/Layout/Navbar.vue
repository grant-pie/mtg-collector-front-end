<!-- components/Layout/Navbar.vue -->
<template>
  <nav class="bg-gray-800 text-white p-4">
    <div class="container mx-auto flex justify-between items-center">
      <NuxtLink to="/" class="text-xl font-bold">MTG Collector</NuxtLink>
      
      <div class="flex space-x-4 items-center">
        <NuxtLink 
          v-if="isAuthenticated" 
          to="/players" 
          class="hover:text-blue-300"
        >
          Players
        </NuxtLink>
        <NuxtLink 
          v-if="isAuthenticated" 
          to="/profile" 
          class="hover:text-blue-300"
        >
          Profile
        </NuxtLink>
        <NuxtLink 
          v-if="isAuthenticated" 
          to="/cards" 
          class="hover:text-blue-300"
        >
          My Cards
        </NuxtLink>
        <NuxtLink 
          v-if="isAuthenticated" 
          to="/decks" 
          class="hover:text-blue-300"
        >
          My Decks
        </NuxtLink>
        <NuxtLink 
          v-if="isAdmin" 
          to="/admin" 
          class="hover:text-blue-300"
        >
          Admin
        </NuxtLink>
        
        <!-- Dynamic Login/Logout Button -->
        <button 
          v-if="isAuthenticated" 
          @click="logout" 
          class="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded"
        >
          Logout
        </button>
        <LoginButton v-else />
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useAuthStore } from '~/stores/auth';
import { useRouter } from 'vue-router';
import LoginButton from '~/components/Auth/LoginButton.vue';

const router = useRouter();
const authStore = useAuthStore();
const { isAuthenticated, isAdmin } = storeToRefs(authStore);

const logout = async () => {
  authStore.logout();
  // Redirect to home page after logout
  router.push('/');
};
</script>
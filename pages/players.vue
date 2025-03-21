<!-- pages/players.vue -->
<template>
    <div class="container mx-auto py-8 px-4">
      <h1 class="text-3xl font-bold mb-6">Players</h1>
      
      <!-- Loading state -->
      <div v-if="userStore.usernamesLoading" class="flex justify-center my-8">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
      
      <!-- Error state -->
      <div v-else-if="userStore.usernamesError" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        <p>{{ userStore.usernamesError }}</p>
        <button @click="fetchUsernames" class="mt-2 bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded">
          Try Again
        </button>
      </div>
      
      <!-- Empty state -->
      <div v-else-if="userStore.publicUsernames.length === 0" class="text-center my-8">
        <p class="text-gray-600 text-lg">No players found.</p>
      </div>
      
      <!-- Players list -->
      <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div 
          v-for="user in userStore.publicUsernames" 
          :key="user.id"
          class="bg-white shadow-md rounded-lg p-6 border border-gray-200"
        >
          <h2 class="text-xl font-semibold mb-4">{{ user.username }}</h2>
          
          <div class="flex space-x-3 mt-4">
            <button 
              class="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded flex items-center"
              @click="selectedUserName = user.username"
            >
              <span class="mr-1">View Cards</span>
            </button>
            
            <button 
              class="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded flex items-center"
              @click="() => {}"
            >
              <span class="mr-1">View Decks</span>
            </button>
          </div>
        </div>
      </div>


      <div class="mb-6 flex justify-between items-center">
        <h2 class="text-2xl font-bold">User's Cards</h2>
        <div  class="text-gray-600">Loading...</div>
      </div>
      
      <UserCardsList :userName="selectedUserName" />
    </div>
  </template>
  
  <script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { useAuthStore } from '~/stores/auth';
  import { onMounted, watch } from 'vue';
  import { useUserStore } from '~/stores/user';
  
  const userStore = useUserStore();
  
  const selectedUserName = ref('');

  const fetchUsernames = async () => {
    await userStore.fetchAllUsernames();
  };
  
  watch(selectedUserName, () => {
    console.log(selectedUserName.value);
  });
  
  onMounted(() => {
    fetchUsernames();
  });


  definePageMeta({
    middleware: ['auth']
  });
  
  const authStore = useAuthStore();
  const { isAuthenticated, user, loading } = storeToRefs(authStore);
  
  onMounted(async () => {
    await authStore.initAuth();
  });
  </script>
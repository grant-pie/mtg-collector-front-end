<template>
    <div>
      <Header 
        title="MTG Tournament Master" 
        subtitle="Track your Magic: The Gathering cards for tournaments"
      />
      
      <div class="mt-8">
        <div class="max-w-3xl mx-auto bg-white p-8 rounded shadow-md">
          <h2 class="text-2xl font-bold mb-4">Welcome to MTG Tournament Master</h2>
          
          <p class="mb-4">
            This application helps you keep track of your Magic: The Gathering cards for tournaments.
            Login to view your card collection and manage your tournament decks.
          </p>
          
          <div v-if="!isAuthenticated" class="mt-6">
            <h3 class="text-xl font-semibold mb-2">Get Started</h3>
            <p class="mb-4">Login with your Google account to begin tracking your cards.</p>
            <LoginButton />
          </div>
          
          <div v-else class="mt-6">
            <h3 class="text-xl font-semibold mb-2">Your Account</h3>
            <p class="mb-4">Welcome back! You're logged in as {{ user?.name }}.</p>
            <div class="flex space-x-4">
              <NuxtLink 
                to="/profile" 
                class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                View Profile
              </NuxtLink>
              <NuxtLink 
                to="/cards" 
                class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                View My Cards
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { storeToRefs } from 'pinia';
  import { useAuthStore } from '~/stores/auth';
  import Header from '~/components/Layout/Header.vue';
  import LoginButton from '~/components/Auth/LoginButton.vue';
  
  const authStore = useAuthStore();
  const { isAuthenticated, user } = storeToRefs(authStore);
  
  // Initialize auth state
  onMounted(async () => {
    await authStore.initAuth();
  });
  </script>
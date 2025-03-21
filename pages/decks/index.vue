<template>
  <div>
    <Header 
      title="My Deck Collection" 
      subtitle="View and manage your Magic: The Gathering decks"
    />
    
    <div class="mt-8">
      <div v-if="!isAuthenticated" class="text-center py-10">
        <p>Please log in to view your decks.</p>
        <LoginButton class="mt-4" />
      </div>
      
      <template v-else>
        <div class="mb-6 flex justify-between items-center">
          <h2 class="text-2xl font-bold">Your Decks</h2>
          <div v-if="loading" class="text-gray-600">Loading...</div>
        </div>
        
        <UserDecksList :userId="user?.id" />
      </template>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useAuthStore } from '~/stores/auth';
import Header from '~/components/Layout/Header.vue';
import LoginButton from '~/components/Auth/LoginButton.vue';
import UserDecksList from '~/components/User/UserDecksList.vue';

definePageMeta({
  middleware: ['auth']
});

const authStore = useAuthStore();
const { isAuthenticated, user, loading } = storeToRefs(authStore);

onMounted(async () => {
  await authStore.initAuth();
});
</script>
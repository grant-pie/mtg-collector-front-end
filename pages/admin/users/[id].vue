<template>
  <div>
    <Header 
      title="Manage User Cards" 
      :subtitle="user ? `Managing cards for ${user.firstName} ${user.lastName}` : 'Loading user...'"
    />
    
    <div class="mt-8">
      <!-- Back to admin dashboard -->
      <NuxtLink 
        to="/admin" 
        class="flex items-center mb-4 text-blue-600 hover:text-blue-800"
      >
        <span class="mr-1">←</span> Back to Admin Dashboard
      </NuxtLink>
      
      <div v-if="loading" class="text-center py-10">
        <p>Loading user data...</p>
      </div>
      
      <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {{ error }}
      </div>
      
      <div v-else-if="user" class="space-y-6">
        <!-- User Info -->
        <div class="bg-white p-6 rounded shadow-md">
          <h2 class="text-2xl font-bold mb-2">User Information</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-gray-600">Name</p>
              <p>{{ user.firstName }} {{ user.lastName }}</p>
            </div>
            <div>
              <p class="text-gray-600">Email</p>
              <p>{{ user.email }}</p>
            </div>
            <div>
              <p class="text-gray-600">Role</p>
              <p>{{ user.role }}</p>
            </div>
            <div v-if="user.createdAt">
              <p class="text-gray-600">Member Since</p>
              <p>{{ new Date(user.createdAt).toLocaleDateString() }}</p>
            </div>
          </div>
        </div>
        
        <!-- Add Card Form -->
        <div class="bg-white p-6 rounded shadow-md">
          <h2 class="text-2xl font-bold mb-4">Add Card to User</h2>
          <form @submit.prevent="addCard">
            <div class="mb-4">
              <label for="scryfallId" class="block text-gray-700 mb-2">Card Scryfall ID</label>
              <input 
                v-model="newCardId"
                type="text" 
                id="scryfallId" 
                class="w-full p-2 border rounded"
                placeholder="Enter card's multiverse ID"
                required
              />
            </div>
            <button 
              type="submit" 
              class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              :disabled="cardStore.loading"
            >
              {{ cardStore.loading ? 'Adding...' : 'Add Card' }}
            </button>
          </form>
        </div>
        
        <!-- Import Cards List -->
        <ImportCardsList :userId="userId" />
        <ImportDeck :userId="userId" />
        
        <!-- User's Cards -->
        <div class="bg-white p-6 rounded shadow-md">
          <h2 class="text-2xl font-bold mb-4">User's Cards</h2>
          <UserCardsList 
          :userId="userId" 
          :cardActions="['Remove']"
          @onClickAction="onClickAction"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useCardStore } from '~/stores/card';
import { useAuthStore } from '~/stores/auth';
import Header from '~/components/Layout/Header.vue';
import UserCardsList from '~/components/User/UserCardsList.vue';
import ImportCardsList from '~/components/Admin/ImportCardsList.vue';
import ImportDeck from '~/components/Admin/ImportDeck.vue';
import { useRuntimeConfig } from '#app';

definePageMeta({
  middleware: ['admin']
});

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  picture?: string;
  role: string;
  createdAt?: string;
}


const route = useRoute();
const userId = route.params.id as string;
const config = useRuntimeConfig();
const authStore = useAuthStore();
const cardStore = useCardStore();

const loading = ref(true);
const error = ref<string | null>(null);
const user = ref<User | null>(null);
const newCardId = ref('');





// Fetch user data
const fetchUserData = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const response = await $fetch<User>(`${config.public.apiBaseUrl}/users/${userId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    });
    
    user.value = response;
    console.log('Fetched user data:', user.value);
  } catch (err) {
    console.error('Error fetching user data:', err);
    error.value = 'Failed to load user data';
  } finally {
    loading.value = false;
  }
};

// Add card to user
const addCard = async () => {
  if (!newCardId.value) return;
  
  await cardStore.addCardToUser(userId, newCardId.value);
  newCardId.value = ''; // Clear input after adding
};

onMounted(async () => {
  await authStore.initAuth();
  
  if (authStore.token) {
    await fetchUserData();
    await cardStore.fetchUserCards(userId);
  } else {
    error.value = 'Authentication required';
  }
});

const removeCard = (cardId: string, userId: string) => {

  cardStore.removeCard(cardId, userId);

};

const onClickAction = (actionAndCardObj: Object) => {
  console.log(actionAndCardObj)

  if(actionAndCardObj.action === 'Remove'){
    removeCard(actionAndCardObj.card.id, actionAndCardObj.card.userId);
  }
}
</script>
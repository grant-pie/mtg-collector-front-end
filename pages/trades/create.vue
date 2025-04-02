<template>
    <div class="bg-white shadow rounded-lg p-6">
      <h1 class="text-2xl font-bold mb-2">Create New Trade</h1>
      <p class="text-gray-600 mb-6">Exchange cards with another user</p>
  
      <!-- Step Progress -->
      <div class="mb-10">
        <div class="flex items-center">
          <div class="flex items-center relative">
            <div class="rounded-full h-8 w-8 flex items-center justify-center bg-blue-500 text-white">1</div>
            <div class="absolute top-0 -ml-4 text-xs font-medium text-blue-500 mt-10 w-16 text-center">
              Select Partner
            </div>
          </div>
          <div class="flex-auto border-t-2" :class="step > 1 ? 'border-blue-500' : 'border-gray-300'"></div>
          <div class="flex items-center relative">
            <div class="rounded-full h-8 w-8 flex items-center justify-center" 
              :class="step > 1 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'">2</div>
            <div class="absolute top-0 -ml-4 text-xs font-medium mt-10 w-16 text-center" 
              :class="step > 1 ? 'text-blue-500' : 'text-gray-500'">
              Your Cards
            </div>
          </div>
          <div class="flex-auto border-t-2" :class="step > 2 ? 'border-blue-500' : 'border-gray-300'"></div>
          <div class="flex items-center relative">
            <div class="rounded-full h-8 w-8 flex items-center justify-center" 
              :class="step > 2 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'">3</div>
            <div class="absolute top-0 -ml-4 text-xs font-medium mt-10 w-16 text-center" 
              :class="step > 2 ? 'text-blue-500' : 'text-gray-500'">
              Their Cards
            </div>
          </div>
          <div class="flex-auto border-t-2" :class="step > 3 ? 'border-blue-500' : 'border-gray-300'"></div>
          <div class="flex items-center relative">
            <div class="rounded-full h-8 w-8 flex items-center justify-center" 
              :class="step > 3 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'">4</div>
            <div class="absolute top-0 -ml-4 text-xs font-medium mt-10 w-16 text-center" 
              :class="step > 3 ? 'text-blue-500' : 'text-gray-500'">
              Review
            </div>
          </div>
        </div>
      </div>
      <br>
      <!-- Step 1: Select Trading Partner -->
      <div v-if="step === 1" class=" mb-6">
        <div v-if="userStore.usernamesLoading" class="flex justify-center my-10">
          <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
        
        <div v-else-if="userStore.usernamesError" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>{{ userStore.usernamesError }}</p>
        </div>
        
        <div v-else>
          <div class="mb-4">
            <label for="searchUser" class="block text-sm font-medium text-gray-700">Search for a user</label>
            <input 
              id="searchUser"
              v-model="userSearch" 
              type="text" 
              placeholder="Type username to search" 
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          
          <div class="mt-6">
            <h3 class="text-md font-medium mb-3">Select a user to trade with:</h3>
            
            <div v-if="filteredUsers.length === 0" class="text-center py-6 bg-gray-50 rounded-lg">
              <p class="text-gray-500">No users found matching your search criteria.</p>
            </div>
            
            <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto p-2">
              <div 
                v-for="user in filteredUsers" 
                :key="user.id" 
                @click="selectPartner(user)"
                class="border rounded-lg p-4 cursor-pointer hover:bg-blue-50 transition"
                :class="selectedPartner && selectedPartner.id === user.id ? 'border-blue-500 bg-blue-50' : ''"
              >
                <div class="flex items-center">
                  <div class="bg-gray-200 rounded-full h-10 w-10 flex items-center justify-center text-gray-600 mr-3">
                    {{ user.username.charAt(0).toUpperCase() }}
                  </div>
                  <div>
                    <p class="font-medium">{{ user.username }}</p>
                    <p class="text-xs text-gray-500">User ID: {{ truncateId(user.id) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Step 2: Select Your Cards to Offer -->
      <div v-else-if="step === 2">
        <div class="mb-4 flex justify-between items-center">
          <h2 class="text-lg font-semibold">Select Cards to Offer</h2>
          <div>
            <span class="text-sm text-gray-600">Selected: {{ initiatorCards.length }}</span>
          </div>
        </div>
  
        <div v-if="initiatorCards.length > 0" class="mb-6">
          <h3 class="font-medium mb-2">Selected Cards</h3>
          <div class="flex flex-wrap gap-2">
            <div 
              v-for="card in initiatorCards" 
              :key="card.id" 
              class="bg-blue-50 border border-blue-200 rounded px-3 py-1 flex items-center"
            >
              <span class="text-sm mr-2">{{ truncateId(card.id) }}</span>
              <button @click="removeInitiatorCard(card)" class="text-red-500 hover:text-red-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
  
        <UserCardsList
          :userId="authStore.user?.id"
          :cardActions="['trade']"
          :excludeCards="initiatorCards"
          @onClickAction="handleInitiatorCardAction"
        />
      </div>
      
      <!-- Step 3: Select Partner's Cards to Request -->
      <div v-else-if="step === 3">
        <div class="mb-4 flex justify-between items-center">
          <h2 class="text-lg font-semibold">Select Cards to Request</h2>
          <div>
            <span class="text-sm text-gray-600">Selected: {{ receiverCards.length }}</span>
          </div>
        </div>
  
        <div v-if="receiverCards.length > 0" class="mb-6">
          <h3 class="font-medium mb-2">Selected Cards</h3>
          <div class="flex flex-wrap gap-2">
            <div 
              v-for="card in receiverCards" 
              :key="card.id" 
              class="bg-blue-50 border border-blue-200 rounded px-3 py-1 flex items-center"
            >
              <span class="text-sm mr-2">{{ truncateId(card.id) }}</span>
              <button @click="removeReceiverCard(card)" class="text-red-500 hover:text-red-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
  
        <UserCardsList
          :userName="selectedPartner?.username"
          :cardActions="['trade']"
          :excludeCards="receiverCards"
          @onClickAction="handleReceiverCardAction"
        />
      </div>
      
      <!-- Step 4: Review Trade -->
      <div v-else-if="step === 4">
        <div class="mb-6">
          <h2 class="text-lg font-semibold mb-4">Review Your Trade</h2>
          <div class="bg-gray-50 p-4 rounded-lg">
            <p class="mb-2">
              Trading with: <span class="font-medium">{{ selectedPartner?.username }}</span>
            </p>
          </div>
        </div>
        
        <div class="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 class="font-medium text-gray-700 mb-3">Your Offered Cards</h3>
            <div v-if="initiatorCards.length === 0" class="text-center p-6 bg-gray-50 rounded-lg">
              <p class="text-gray-500">You aren't offering any cards</p>
            </div>
            <div v-else class="border rounded-lg p-4 bg-gray-50">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div 
                  v-for="card in initiatorCards" 
                  :key="card.id" 
                  class="border rounded p-2 bg-white"
                >
                  <div class="text-sm">{{ truncateId(card.id) }}</div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 class="font-medium text-gray-700 mb-3">Cards You're Requesting</h3>
            <div v-if="receiverCards.length === 0" class="text-center p-6 bg-gray-50 rounded-lg">
              <p class="text-gray-500">You aren't requesting any cards</p>
            </div>
            <div v-else class="border rounded-lg p-4 bg-gray-50">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div 
                  v-for="card in receiverCards" 
                  :key="card.id" 
                  class="border rounded p-2 bg-white"
                >
                  <div class="text-sm">{{ truncateId(card.id) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div v-if="tradeStore.createTradeError" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>{{ tradeStore.createTradeError }}</p>
          <button @click="tradeStore.resetCreateTradeState" class="text-sm underline">Dismiss</button>
        </div>
  
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">Trade Notes (optional)</label>
          <textarea 
            v-model="tradeNotes" 
            rows="3" 
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Add any comments or notes about this trade..."
          ></textarea>
        </div>
      </div>
  
      <!-- Navigation Buttons -->
      <div class="flex justify-between pt-4 border-t">
        <button 
          v-if="step > 1" 
          @click="prevStep" 
          class="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
        >
          Back
        </button>
        <div v-else></div>
        
        <div class="flex space-x-3">
          <NuxtLink 
            to="/trades" 
            class="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </NuxtLink>
          
          <button 
            v-if="step < 4" 
            @click="nextStep" 
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            :disabled="!canProceed"
          >
            Next
          </button>
          
          <button 
            v-else 
            @click="createTrade" 
            class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
            :disabled="tradeStore.createTradeLoading || !(initiatorCards.length > 0 || receiverCards.length > 0)"
          >
            <span v-if="tradeStore.createTradeLoading">Creating...</span>
            <span v-else>Create Trade</span>
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import { useTradeStore } from '~/stores/trade';
  import { useUserStore } from '~/stores/user';
  import { useAuthStore } from '~/stores/auth';
  
  const router = useRouter();
  const tradeStore = useTradeStore();
  const userStore = useUserStore();
  const authStore = useAuthStore();
  
  // Step tracking
  const step = ref(1);
  
  // Selected partner
  const selectedPartner = ref(null);
  const userSearch = ref('');
  
  // Selected cards
  const initiatorCards = ref([]);
  const receiverCards = ref([]);
  
  // Trade notes
  const tradeNotes = ref('');
  
  // Computed properties
  const filteredUsers = computed(() => {
    if (!userStore.publicUsernames) return [];
    
    // Filter out the current user and apply search
    return userStore.publicUsernames.filter(user => 
      user.id !== authStore.user?.id && 
      user.username.toLowerCase().includes(userSearch.value.toLowerCase())
    );
  });
  
  const canProceed = computed(() => {
    if (step.value === 1) return selectedPartner.value !== null;
    if (step.value === 2) return true; // Can proceed even without selecting cards
    if (step.value === 3) return true; // Can proceed even without selecting cards
    return true;
  });
  
  // Fetch usernames on component mount
  onMounted(async () => {
    if (!userStore.publicUsernames.length) {
      await userStore.fetchAllUsernames();
    }
  });
  
  // Reset any errors on step change
  watch(step, () => {
    tradeStore.resetCreateTradeState();
  });
  
  // Methods
  const selectPartner = (user) => {
    selectedPartner.value = user;
  };
  
  const truncateId = (id) => {
    return id.substring(0, 8) + '...';
  };
  
  const handleInitiatorCardAction = ({ action, card }) => {
    if (action === 'trade') {
      // Add card to initiator cards if not already selected
      if (!initiatorCards.value.some(c => c.id === card.id)) {
        initiatorCards.value.push(card);
      }
    }
  };
  
  const handleReceiverCardAction = ({ action, card }) => {
    if (action === 'trade') {
      // Add card to receiver cards if not already selected
      if (!receiverCards.value.some(c => c.id === card.id)) {
        receiverCards.value.push(card);
      }
    }
  };
  
  const removeInitiatorCard = (card) => {
    initiatorCards.value = initiatorCards.value.filter(c => c.id !== card.id);
  };
  
  const removeReceiverCard = (card) => {
    receiverCards.value = receiverCards.value.filter(c => c.id !== card.id);
  };
  
  const nextStep = () => {
    if (step.value < 4) {
      step.value++;
    }
  };
  
  const prevStep = () => {
    if (step.value > 1) {
      step.value--;
    }
  };
  
  const createTrade = async () => {
    if (!selectedPartner.value) {
      return;
    }
    
    // At least one side needs to have cards
    if (initiatorCards.value.length === 0 && receiverCards.value.length === 0) {
      return;
    }
    
    const payload = {
      receiverId: selectedPartner.value.id,
      initiatorCardIds: initiatorCards.value.map(card => card.id),
      receiverCardIds: receiverCards.value.map(card => card.id)
    };
    
    const newTrade = await tradeStore.createTrade(payload);
    
    if (newTrade) {
      // Navigate to the trade details page
      router.push(`/trades/${newTrade.id}`);
    }
  };
  </script>
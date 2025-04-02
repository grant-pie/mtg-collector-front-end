<template>
  <div v-if="tradeStore.loading" class="flex justify-center my-10">
    <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
  </div>

  <div v-else-if="tradeStore.error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
    <p>{{ tradeStore.error }}</p>
    <button @click="tradeStore.resetErrorState" class="text-sm underline">Dismiss</button>
  </div>

  <div v-else-if="!trade" class="text-center my-10">
    <p class="text-gray-600">Trade not found or you don't have permission to view it.</p>
    <NuxtLink to="/trades" class="text-blue-500 hover:text-blue-600 mt-2 inline-block">Back to trades</NuxtLink>
  </div>

  <div v-else class="bg-white rounded-lg shadow">
    <!-- Trade Header -->
    <div class="border-b p-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold">Trade Details</h1>
          <p class="text-gray-600">Trade ID: {{ trade.id }}</p>
        </div>
        <div class="flex items-center">
          <span 
            class="text-sm px-3 py-1 rounded-full mr-3" 
            :class="getStatusClass(trade.status)"
          >
            {{ formatStatus(trade.status) }}
          </span>
          <NuxtLink 
            to="/trades" 
            class="text-gray-500 hover:text-gray-700"
          >
            Back to trades
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Trade Info -->
    <div class="p-6 border-b">
      <div class="grid md:grid-cols-2 gap-6">
        <div>
          <h2 class="text-lg font-semibold mb-2">Trade Info</h2>
          <ul class="space-y-2">
            <li><span class="text-gray-600">Created:</span> {{ formatDate(trade.createdAt) }}</li>
            <li v-if="trade.respondedAt">
              <span class="text-gray-600">Responded:</span> {{ formatDate(trade.respondedAt) }}
            </li>
            <li>
              <span class="text-gray-600">Last Updated:</span> {{ formatDate(trade.updatedAt) }}
            </li>
          </ul>
        </div>
        <div>
          <h2 class="text-lg font-semibold mb-2">Trade Partners</h2>
          <div class="flex flex-col md:flex-row md:justify-around items-center p-4 bg-gray-50 rounded-lg">
            <div class="text-center mb-4 md:mb-0">
              <p class="text-sm text-gray-500">Initiator</p>
              <p class="font-medium">{{ getUsernameById(trade.initiatorId) }}</p>
              <p class="text-xs text-gray-500">{{ isCurrentUser(trade.initiatorId) ? '(You)' : '' }}</p>
            </div>
            <div class="text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
            <div class="text-center">
              <p class="text-sm text-gray-500">Receiver</p>
              <p class="font-medium">{{ getUsernameById(trade.receiverId) }}</p>
              <p class="text-xs text-gray-500">{{ isCurrentUser(trade.receiverId) ? '(You)' : '' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Cards Being Traded -->
    <div class="p-6">
      <h2 class="text-lg font-semibold mb-4">Cards Being Traded</h2>
      <div class="grid md:grid-cols-2 gap-6">
        <div>
          <h3 class="font-medium text-gray-700 mb-3">
            {{ isInitiator ? 'Your Offered Cards' : 'Cards Offered to You' }}
          </h3>
          <!-- No cards message -->
          <div v-if="trade.initiatorCards.length === 0" class="text-center p-6 bg-gray-50 rounded-lg">
            <p class="text-gray-500">No cards offered in this trade</p>
          </div>
          <!-- Card list -->
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div 
              v-for="cardId in trade.initiatorCards" 
              :key="cardId" 
              class="border rounded-lg p-3 bg-gray-50"
            >
              <div v-if="cardDetails[cardId]" class="mb-1">
                <p class="text-sm font-medium">{{ cardDetails[cardId].cardDetails.name }}</p>
                <p class="text-xs text-gray-500">ID: {{ truncateId(cardId) }}</p>
              </div>
              <div v-else class="flex items-center">
                <div class="animate-pulse h-4 w-24 bg-gray-200 rounded mb-1"></div>
                <p class="text-xs text-gray-500 ml-1">loading...</p>
              </div>
            </div>
          </div>
          <!-- Add cards button (for initiator if pending) -->
          <div v-if="isInitiator && trade.status === 'pending'" class="mt-4">
            <button 
              @click="openCardSelector('initiator')" 
              class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
            >
              {{ trade.initiatorCards.length > 0 ? 'Edit Offered Cards' : 'Add Cards to Offer' }}
            </button>
          </div>
        </div>

        <div>
          <h3 class="font-medium text-gray-700 mb-3">
            {{ isInitiator ? 'Cards Requested from Partner' : 'Your Cards Requested' }}
          </h3>
          <!-- No cards message -->
          <div v-if="trade.receiverCards.length === 0" class="text-center p-6 bg-gray-50 rounded-lg">
            <p class="text-gray-500">No cards requested in this trade</p>
          </div>
          <!-- Card list -->
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div 
              v-for="cardId in trade.receiverCards" 
              :key="cardId" 
              class="border rounded-lg p-3 bg-gray-50"
            >
              <div v-if="cardDetails[cardId]" class="mb-1">
                <p class="text-sm font-medium">{{ cardDetails[cardId].cardDetails.name }}</p>
                <p class="text-xs text-gray-500">ID: {{ truncateId(cardId) }}</p>
              </div>
              <div v-else class="flex items-center">
                <div class="animate-pulse h-4 w-24 bg-gray-200 rounded mb-1"></div>
                <p class="text-xs text-gray-500 ml-1">loading...</p>
              </div>
            </div>
          </div>
          <!-- Add cards button (for initiator if pending) -->
          <div v-if="isInitiator && trade.status === 'pending'" class="mt-4">
            <button 
              @click="openCardSelector('receiver')" 
              class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
            >
              {{ trade.receiverCards.length > 0 ? 'Edit Requested Cards' : 'Request Cards' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Action buttons based on trade status and user role -->
    <div class="p-6 bg-gray-50 border-t">
      <div v-if="trade.status === 'pending'" class="flex justify-end space-x-3">
        <!-- Cancel button for initiator -->
        <button 
          v-if="isInitiator" 
          @click="cancelTrade"
          class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded transition"
          :disabled="tradeStore.loading"
        >
          Cancel Trade
        </button>
        
        <!-- Accept/Reject buttons for receiver -->
        <template v-if="!isInitiator">
          <button 
            @click="rejectTrade"
            class="px-4 py-2 bg-white border border-red-500 text-red-500 hover:bg-red-50 rounded transition"
            :disabled="tradeStore.respondTradeLoading"
          >
            Reject
          </button>
          <button 
            @click="acceptTrade"
            class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded transition"
            :disabled="tradeStore.respondTradeLoading"
          >
            Accept
          </button>
        </template>
      </div>
      <div v-else-if="trade.status === 'accepted'" class="text-center text-green-600">
        <p>This trade has been completed successfully.</p>
      </div>
      <div v-else-if="trade.status === 'rejected'" class="text-center text-red-600">
        <p>This trade was rejected.</p>
      </div>
      <div v-else-if="trade.status === 'canceled'" class="text-center text-gray-600">
        <p>This trade was canceled.</p>
      </div>
    </div>
  </div>

  <!-- Card Selection Modal -->
  <div v-if="showCardSelector" class="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-75 flex items-center justify-center">
    <div class="relative bg-white w-full max-w-6xl mx-auto rounded-lg shadow-xl p-6">
      <button 
        @click="closeCardSelector" 
        class="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      
      <h2 class="text-xl font-bold mb-4">
        {{ selectorMode === 'initiator' ? 'Select Cards to Offer' : 'Select Cards to Request' }}
      </h2>
      
      <div class="mb-4">
        <p>
          {{ selectorMode === 'initiator' 
            ? 'Select cards from your collection to offer in this trade.' 
            : `Select cards from ${getUsernameById(trade.receiverId)}'s collection to request in this trade.` 
          }}
        </p>
      </div>
      
      <!-- Selected Cards Preview -->
      <div v-if="selectedCards.length > 0" class="mb-6">
        <h3 class="font-medium mb-2">Selected Cards ({{ selectedCards.length }})</h3>
        <div class="flex flex-wrap gap-2">
          <div 
            v-for="card in selectedCards" 
            :key="card.id" 
            class="bg-blue-50 border border-blue-200 rounded px-3 py-1 flex items-center"
          >
            <span class="text-sm mr-2" v-if="cardDetails[card.id]">
              {{ cardDetails[card.id].cardDetails.name }}
            </span>
            <span class="text-sm mr-2" v-else>
              {{ truncateId(card.id) }}
            </span>
            <button @click="removeSelectedCard(card)" class="text-red-500 hover:text-red-700">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <!-- User Card List Component -->
      <UserCardsList 
        :userId="selectorMode === 'initiator' ? trade.initiatorId : trade.receiverId"
        :cardActions="['trade']"
        :excludeCards="selectedCards"
        @onClickAction="handleCardAction"
      />
      
      <div class="mt-6 flex justify-end space-x-3">
        <button 
          @click="closeCardSelector" 
          class="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
        >
          Cancel
        </button>
        <button 
          @click="updateTradeCards" 
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          :disabled="selectedCards.length === 0"
        >
          Update Trade
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTradeStore, TradeStatus } from '~/stores/trade';
import { useUserStore } from '~/stores/user';
import { useAuthStore } from '~/stores/auth';
import { useCardStore } from '~/stores/card';  // Added card store import

const route = useRoute();
const router = useRouter();
const tradeStore = useTradeStore();
const userStore = useUserStore();
const authStore = useAuthStore();
const cardStore = useCardStore();  // Added card store

// Card selector modal state
const showCardSelector = ref(false);
const selectorMode = ref('initiator'); // 'initiator' or 'receiver'
const selectedCards = ref([]);

// Store for card details
const cardDetails = ref({});
const loadingCardDetails = ref(false);

// Get trade ID from route
const tradeId = computed(() => route.params.id);

// Get current trade from store
const trade = computed(() => tradeStore.currentTrade);

// Check if current user is the trade initiator
const isInitiator = computed(() => {
  if (!trade.value || !authStore.user) return false;
  return trade.value.initiatorId === authStore.user.id;
});

// Fetch trade and usernames on page load
onMounted(async () => {
  if (tradeId.value) {
    await Promise.all([
      tradeStore.fetchTradeById(tradeId.value),
      userStore.fetchAllUsernames()
    ]);
  }
});

// Watch for trade changes to load card details
watch(trade, async (newTrade) => {
  if (newTrade) {
    await fetchAllCardDetails();
  }
}, { immediate: true });

// Fetch all card details
const fetchAllCardDetails = async () => {
  if (!trade.value) return;
  
  loadingCardDetails.value = true;
  
  const allCardIds = [
    ...trade.value.initiatorCards,
    ...trade.value.receiverCards
  ];
  
  // Fetch details for each card
  for (const cardId of allCardIds) {
    if (!cardDetails.value[cardId]) {
      const cardInfo = await cardStore.fetchCardById(cardId);
      if (cardInfo) {
        cardDetails.value[cardId] = cardInfo;
      }
    }
  }
  
  loadingCardDetails.value = false;
};

// Helper functions
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatStatus = (status) => {
  switch (status) {
    case TradeStatus.PENDING: return 'Pending';
    case TradeStatus.ACCEPTED: return 'Accepted';
    case TradeStatus.REJECTED: return 'Rejected';
    case TradeStatus.CANCELED: return 'Canceled';
    default: return status;
  }
};

const getStatusClass = (status) => {
  switch (status) {
    case TradeStatus.PENDING: return 'bg-yellow-100 text-yellow-800';
    case TradeStatus.ACCEPTED: return 'bg-green-100 text-green-800';
    case TradeStatus.REJECTED: return 'bg-red-100 text-red-800';
    case TradeStatus.CANCELED: return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getUsernameById = (userId) => {
  const user = userStore.publicUsernames.find(u => u.id === userId);
  return user ? user.username : userId.substring(0, 8);
};

const isCurrentUser = (userId) => {
  return userId === authStore.user?.id;
};

const truncateId = (id) => {
  return id.substring(0, 8) + '...';
};

// Card selector functions
const openCardSelector = (mode) => {
  selectorMode.value = mode;
  selectedCards.value = mode === 'initiator' 
    ? [...trade.value.initiatorCards.map(id => ({ id }))]
    : [...trade.value.receiverCards.map(id => ({ id }))];
  showCardSelector.value = true;
  
  // Load card details for selected cards if not already loaded
  selectedCards.value.forEach(async (card) => {
    if (!cardDetails.value[card.id]) {
      const cardInfo = await cardStore.fetchCardById(card.id);
      if (cardInfo) {
        cardDetails.value[card.id] = cardInfo;
      }
    }
  });
};

const closeCardSelector = () => {
  showCardSelector.value = false;
  selectedCards.value = [];
};

const handleCardAction = async ({ action, card }) => {
  if (action === 'trade') {
    // Add card to selected cards if not already selected
    if (!selectedCards.value.some(c => c.id === card.id)) {
      selectedCards.value.push(card);
      
      // Load card details if not already loaded
      if (!cardDetails.value[card.id]) {
        const cardInfo = await cardStore.fetchCardById(card.id);
        if (cardInfo) {
          cardDetails.value[card.id] = cardInfo;
        }
      }
    }
  }
};

const removeSelectedCard = (card) => {
  selectedCards.value = selectedCards.value.filter(c => c.id !== card.id);
};

const updateTradeCards = async () => {
  try {
    // Create payload to update the trade
    const payload = {
      receiverId: trade.value.receiverId,
      initiatorCardIds: selectorMode.value === 'initiator' 
        ? selectedCards.value.map(card => card.id) 
        : trade.value.initiatorCards,
      receiverCardIds: selectorMode.value === 'receiver' 
        ? selectedCards.value.map(card => card.id) 
        : trade.value.receiverCards
    };
    
    // For now, we'll just cancel the current trade and create a new one
    // In a real implementation, you might want to have an endpoint to update a trade
    await tradeStore.cancelTrade(trade.value.id);
    const newTrade = await tradeStore.createTrade(payload);
    
    if (newTrade) {
      closeCardSelector();
      // Navigate to the new trade details
      router.push(`/trades/${newTrade.id}`);
    }
  } catch (error) {
    console.error('Error updating trade:', error);
  }
};

// Trade actions
const cancelTrade = async () => {
  if (confirm('Are you sure you want to cancel this trade?')) {
    await tradeStore.cancelTrade(tradeId.value);
    router.push('/trades');
  }
};

const acceptTrade = async () => {
  if (confirm('Are you sure you want to accept this trade?')) {
    await tradeStore.respondToTrade(tradeId.value, { accept: true });
  }
};

const rejectTrade = async () => {
  if (confirm('Are you sure you want to reject this trade?')) {
    await tradeStore.respondToTrade(tradeId.value, { accept: false });
  }
};
</script>
<template>
    <div class="trades-container">
      <div class="mb-8">
        <h1 class="text-2xl font-bold">My Trades</h1>
        <p class="text-gray-600">Manage your card trade offers</p>
      </div>

      <!-- Create new trade button -->
      <NuxtLink to="/trades/create" class=" bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition">
        <span class="material-icons">Start Trade</span>
      </NuxtLink>
  
      <!-- Loading state -->
      <div v-if="tradeStore.loading" class="flex justify-center my-10">
        <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
  
      <!-- Error state -->
      <div v-else-if="tradeStore.error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
        <p>{{ tradeStore.error }}</p>
        <button @click="tradeStore.resetErrorState" class="text-sm underline">Dismiss</button>
      </div>
  
      <!-- Empty state -->
      <div v-else-if="tradeStore.trades.length === 0" class="text-center my-10">
        <div class="text-5xl mb-4">🃏</div>
        <h3 class="text-xl font-medium mb-2">No trades yet</h3>
        <p class="text-gray-600 mb-6">Start trading cards with other collectors!</p>
        <div class="flex flex-col w-40 mx-auto">
          <NuxtLink to="/cards" class="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition">
          Browse Cards
          </NuxtLink>
        </div>
      </div>
  
      <!-- Tabs -->
      <div v-else class="mb-6">
        <div class="border-b border-gray-200">
          <nav class="flex -mb-px">
            <button 
              @click="activeTab = 'all'" 
              class="px-4 py-2 mr-2 font-medium text-sm"
              :class="activeTab === 'all' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'"
            >
              All Trades
            </button>
            <button 
              @click="activeTab = 'pending'" 
              class="px-4 py-2 mr-2 font-medium text-sm"
              :class="activeTab === 'pending' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'"
            >
              Pending
              <span v-if="pendingCount > 0" class="ml-1 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                {{ pendingCount }}
              </span>
            </button>
            <button 
              @click="activeTab = 'completed'" 
              class="px-4 py-2 mr-2 font-medium text-sm"
              :class="activeTab === 'completed' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'"
            >
              Completed
            </button>
          </nav>
        </div>
      </div>
  
      <!-- Trade List -->
      <div v-if="displayedTrades.length > 0" class="grid gap-4">
        <div v-for="trade in displayedTrades" :key="trade.id" 
          class="border rounded-lg overflow-hidden hover:shadow-md transition bg-white">
          <div class="flex justify-between items-center p-4 border-b bg-gray-50">
            <div class="flex items-center">
              <div class="mr-3">
                <span v-if="isInitiator(trade)" class="text-blue-500">
                  <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Sent</span>
                </span>
                <span v-else class="text-green-500">
                  <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Received</span>
                </span>
              </div>
              <div>
                <h3 class="font-medium">
                  {{ isInitiator(trade) ? 'Trade to ' : 'Trade from ' }}
                  <span class="font-semibold">{{ getUsernameById(isInitiator(trade) ? trade.receiverId : trade.initiatorId) }}</span>
                </h3>
                <p class="text-sm text-gray-500">
                  {{ formatDate(trade.createdAt) }}
                </p>
              </div>
            </div>
            <div class="flex items-center">
              <span class="text-sm px-3 py-1 rounded-full" :class="getStatusClass(trade.status)">
                {{ formatStatus(trade.status) }}
              </span>
            </div>
          </div>
          
          <div class="p-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <h4 class="font-medium mb-2 text-sm text-gray-600">
                  {{ isInitiator(trade) ? 'Your offer' : 'Their offer' }}
                </h4>
                <div class="grid grid-cols-3 gap-2">
                  <div v-for="cardId in trade.initiatorCards" :key="cardId" class="border rounded p-1 text-center">
                    <div v-if="cardDetails[cardId]">
                      <span class="text-sm mr-2">
                        {{ cardDetails[cardId].cardDetails.name }}
                      </span>
                      <img v-if="cardDetails[cardId]" :src="cardDetails[cardId].cardDetails.imageUrl"></img>
                    </div>
                    <div v-else class="text-xs">Card ID: {{ truncateId(cardId) }}</div>
                  </div>
                  <div v-if="trade.initiatorCards.length === 0" class="text-gray-500 text-sm">No cards</div>
                </div>
              </div>
              
              <div>
                <h4 class="font-medium mb-2 text-sm text-gray-600">
                  {{ isInitiator(trade) ? 'Their cards' : 'Your cards' }}
                </h4>
                <div class="grid grid-cols-3 gap-2">
                  <div v-for="cardId in trade.receiverCards" :key="cardId" class="border rounded p-1 text-center">
                    <div v-if="cardDetails[cardId]">
                      <span class="text-sm mr-2">
                        {{ cardDetails[cardId].cardDetails.name }}
                      </span>
                      <img v-if="cardDetails[cardId]" :src="cardDetails[cardId].cardDetails.imageUrl"></img>
                    </div>
                    <div v-else class="text-xs">Card ID: {{ truncateId(cardId) }}</div>
                  </div>
                  <div v-if="trade.receiverCards.length === 0" class="text-gray-500 text-sm">No cards</div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="p-4 border-t bg-gray-50 flex justify-between">
            <NuxtLink :to="`/trades/${trade.id}`" class="text-blue-500 hover:text-blue-700 text-sm font-medium">
              View Details
            </NuxtLink>
            
            <!-- Action buttons based on trade status and user role -->
            <div v-if="trade.status === 'pending'" class="flex space-x-2">
              <!-- Cancel button for initiator -->
              <button 
                v-if="isInitiator(trade)" 
                @click="cancelTrade(trade.id)"
                class="text-sm px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded transition"
                :disabled="tradeStore.loading"
              >
                Cancel Trade
              </button>
              
              <!-- Accept/Reject buttons for receiver -->
              <template v-if="!isInitiator(trade)">
                <button 
                  @click="respondToTrade(trade.id, true)"
                  class="text-sm px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded transition"
                  :disabled="tradeStore.respondTradeLoading"
                >
                  Accept
                </button>
                <button 
                  @click="respondToTrade(trade.id, false)"
                  class="text-sm px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded transition"
                  :disabled="tradeStore.respondTradeLoading"
                >
                  Reject
                </button>
              </template>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Empty filtered results -->
      <div v-else-if="activeTab !== 'all'" class="text-center my-10">
        <p class="text-gray-600">No trades found in this category</p>
        <button @click="activeTab = 'all'" class="text-blue-500 hover:text-blue-600 mt-2">View all trades</button>
      </div>
      

    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useTradeStore, TradeStatus } from '~/stores/trade';
  import { useUserStore } from '~/stores/user';
  import { useAuthStore } from '~/stores/auth';
  
  const tradeStore = useTradeStore();
  const userStore = useUserStore();
  const authStore = useAuthStore();
  const cardStore = useCardStore();
  
  const activeTab = ref('all');
  const cardDetails = ref({});
  const loadingCardDetails = ref(false);
  // Fetch all trades and usernames on page load
  onMounted(async () => {
    await Promise.all([
      tradeStore.fetchAllTrades(),
      userStore.fetchAllUsernames()
    ]);

    fetchAllCardDetails()
    
  });

  const fetchAllCardDetails = async () => {
    console.log(tradeStore.trades);
    const trades = tradeStore.trades;
    if (!trades) return;
    loadingCardDetails.value = true;
    
    const allCardIds = [];
    trades.forEach(trade => {
      
      trade.initiatorCards.forEach((cardId) => {
        allCardIds.push(cardId);
      });

      trade.receiverCards.forEach((cardId) => {
        allCardIds.push(cardId);
      });

    });

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

  // Get displayed trades based on active tab
  const displayedTrades = computed(() => {
    if (activeTab.value === 'all') {
      return tradeStore.trades;
    } else if (activeTab.value === 'pending') {
      return tradeStore.trades.filter(trade => trade.status === TradeStatus.PENDING);
    } else if (activeTab.value === 'completed') {
      return tradeStore.trades.filter(trade => 
        trade.status === TradeStatus.ACCEPTED || 
        trade.status === TradeStatus.REJECTED || 
        trade.status === TradeStatus.CANCELED
      );
    }
    return [];
  });
  
  // Count of pending trades
  const pendingCount = computed(() => {
    return tradeStore.trades.filter(trade => trade.status === TradeStatus.PENDING).length;
  });
  
  // Helper functions
  const isInitiator = (trade) => {
    return trade.initiatorId === authStore.user?.id;
  };
  
  const getUsernameById = (userId) => {
    const user = userStore.publicUsernames.find(u => u.id === userId);
    return user ? user.username : userId.substring(0, 8);
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
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
  
  const truncateId = (id) => {
    return id.substring(0, 8) + '...';
  };
  
  // Action handlers
  const respondToTrade = async (tradeId, accept) => {
    await tradeStore.respondToTrade(tradeId, { accept });
  };
  
  const cancelTrade = async (tradeId) => {
    await tradeStore.cancelTrade(tradeId);
  };
  </script>
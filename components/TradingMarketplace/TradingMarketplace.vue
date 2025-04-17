<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Trading Marketplace</h1>
      <p class="text-gray-600">Find cards available for trade from all users</p>
    </div>

    <!-- Loading state -->
    <div v-if="cardStore.loading" class="text-center py-10">
      <p>Loading trading marketplace...</p>
    </div>
    
    <!-- Error state -->
    <div v-else-if="cardStore.error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      {{ cardStore.error }}
    </div>
    
    <!-- Results with search form and card display -->
    <div v-else>
      <!-- Search Form -->
      <div class="mb-6 bg-white p-4 rounded-lg shadow">
        <h3 class="text-lg font-medium mb-4">Search Trading Marketplace</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Card Name</label>
            <input 
              v-model="searchParams.name" 
              type="text" 
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Card Type</label>
            <input 
              v-model="searchParams.type" 
              type="text" 
              placeholder="Creature, Instant, etc." 
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Colors</label>
            <div class="flex space-x-2 mt-1">
              <label v-for="color in ['W', 'U', 'B', 'R', 'G']" :key="color" class="inline-flex items-center">
                <input 
                  type="checkbox" 
                  :value="color" 
                  v-model="selectedColors" 
                  class="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <span class="ml-1" :class="{
                  'text-yellow-500 font-bold': color === 'W',
                  'text-blue-500 font-bold': color === 'U',
                  'text-gray-800 font-bold': color === 'B',
                  'text-red-500 font-bold': color === 'R',
                  'text-green-500 font-bold': color === 'G'
                }">{{ color }}</span>
              </label>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Rarity</label>
            <select 
              v-model="searchParams.rarity" 
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Any</option>
              <option value="common">Common</option>
              <option value="uncommon">Uncommon</option>
              <option value="rare">Rare</option>
              <option value="mythic">Mythic</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Set</label>
            <input 
              v-model="searchParams.set" 
              type="text" 
              placeholder="e.g. ZNR" 
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Trader Username</label>
            <input 
              v-model="searchParams.username" 
              type="text" 
              placeholder="Search by trader username" 
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Sort By</label>
            <div class="flex space-x-2">
              <select 
                v-model="searchParams.orderBy" 
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Default</option>
                <option value="name">Name</option>
                <option value="convertedManaCost">CMC</option>
                <option value="rarity">Rarity</option>
                <option value="set">Set</option>
                <option value="user.username">Trader</option>
              </select>
              <select 
                v-model="searchParams.orderDirection" 
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="ASC">Ascending</option>
                <option value="DESC">Descending</option>
              </select>
            </div>
          </div>
        </div>
        
        <div class="mt-4 flex justify-end space-x-3">
          <button 
            @click="resetSearch" 
            class="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Reset
          </button>
          <button 
            @click="searchTradingCards" 
            class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Search
          </button>
        </div>
      </div>
      
      <!-- Cards Display -->
      <div v-if="cardStore.tradingMarketplace.length === 0" class="text-center py-10">
        <p>No cards available for trading match your criteria.</p>
      </div>
      
      <div v-else>
        <div class="mb-4 flex justify-between items-center">
          <h3 class="text-lg font-medium">Available for Trade</h3>
          <p class="text-sm text-gray-600">
            Showing {{ cardStore.tradingPagination.itemCount }} of {{ cardStore.tradingPagination.totalItems }} cards
            (Page {{ cardStore.tradingPagination.currentPage }} of {{ cardStore.tradingPagination.totalPages }})
          </p>
        </div>
        
        <!-- Card Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="card in cardStore.tradingMarketplace" :key="card.id" class="bg-white rounded-lg shadow-md overflow-hidden">
            <div v-if="card.cardDetails.imageUrl" class="h-48 bg-gray-100 flex items-center justify-center">
              <img :src="card.cardDetails.imageUrl" :alt="card.cardDetails.name" class="max-h-full max-w-full object-contain">
            </div>
            <div class="p-4">
              <h3 class="font-bold text-lg">{{ card.cardDetails.name }}</h3>
              <p class="text-sm text-gray-600">{{ card.cardDetails.type }}</p>
              <p class="text-sm text-gray-600">{{ card.cardDetails.rarity }}</p>
              <div class="mt-2 flex justify-between items-center">
                <span class="text-sm font-semibold">Trader: {{ card.username }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Pagination Controls -->
        <div v-if="cardStore.tradingPagination.totalPages > 1" class="mt-6 flex justify-center">
          <nav class="flex items-center space-x-2">
            <button 
              @click="goToFirstPage" 
              :disabled="cardStore.tradingPagination.currentPage === 1"
              class="px-3 py-1 rounded border" 
              :class="cardStore.tradingPagination.currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white hover:bg-gray-50'"
            >
              &laquo;
            </button>
            
            <button 
              @click="goToPrevPage" 
              :disabled="cardStore.tradingPagination.currentPage === 1"
              class="px-3 py-1 rounded border" 
              :class="cardStore.tradingPagination.currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white hover:bg-gray-50'"
            >
              &lsaquo;
            </button>
            
            <div class="flex space-x-1">
              <button 
                v-for="page in displayedPageNumbers" 
                :key="page" 
                @click="goToPage(page)"
                class="px-3 py-1 rounded border" 
                :class="page === cardStore.tradingPagination.currentPage ? 'bg-indigo-600 text-white' : 'bg-white hover:bg-gray-50'"
              >
                {{ page }}
              </button>
            </div>
            
            <button 
              @click="goToNextPage" 
              :disabled="cardStore.tradingPagination.currentPage === cardStore.tradingPagination.totalPages"
              class="px-3 py-1 rounded border" 
              :class="cardStore.tradingPagination.currentPage === cardStore.tradingPagination.totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white hover:bg-gray-50'"
            >
              &rsaquo;
            </button>
            
            <button 
              @click="goToLastPage" 
              :disabled="cardStore.tradingPagination.currentPage === cardStore.tradingPagination.totalPages"
              class="px-3 py-1 rounded border" 
              :class="cardStore.tradingPagination.currentPage === cardStore.tradingPagination.totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white hover:bg-gray-50'"
            >
              &raquo;
            </button>
          </nav>
        </div>
        
        <!-- Items per page selector -->
        <div class="mt-4 flex justify-end">
          <div class="flex items-center space-x-2">
            <label class="text-sm text-gray-600">Items per page:</label>
            <select 
              v-model="itemsPerPage" 
              @change="changeItemsPerPage"
              class="rounded border-gray-300 text-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useCardStore } from '~/stores/card';
import { useRouter } from 'vue-router';


const router = useRouter();
const cardStore = useCardStore();


// Search parameters
const searchParams = ref({
  name: '',
  type: '',
  rarity: '',
  set: '',
  username: '',
  orderBy: '',
  orderDirection: 'ASC',
  page: 1,
  limit: 10
});

// Selected colors for checkbox handling
const selectedColors = ref([]);

// Pagination
const itemsPerPage = ref(10);

// Calculate displayed page numbers for pagination
const displayedPageNumbers = computed(() => {
  const totalPages = cardStore.tradingPagination.totalPages;
  const currentPage = cardStore.tradingPagination.currentPage;
  const maxPagesToShow = 5;
  
  if (totalPages <= maxPagesToShow) {
    // If we have fewer pages than the max to show, display all pages
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  
  // Otherwise, show a window around the current page
  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  let endPage = startPage + maxPagesToShow - 1;
  
  // Adjust if we're near the end
  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }
  
  return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
});



// Watch for changes in selectedColors to update searchParams
watch(selectedColors, (newColors) => {
  searchParams.value.colors = newColors.length > 0 ? newColors : undefined;
});

// Load trading marketplace on component mount
onMounted(async () => {
  await cardStore.fetchTradingMarketplace({
    page: 1,
    limit: itemsPerPage.value
  });
});

// Helper to get clean parameters
const getCleanParams = () => {
  // Clean up empty values
  const cleanParams = {};
  for (const [key, value] of Object.entries(searchParams.value)) {
    if (value !== '' && value !== undefined && value !== null) {
      cleanParams[key] = value;
    }
  }
  
  // Add colors from selectedColors
  if (selectedColors.value.length > 0) {
    cleanParams.colors = selectedColors.value;
  }
  
  // Explicitly set the limit to the current itemsPerPage value
  cleanParams.limit = itemsPerPage.value;
  cleanParams.page = searchParams.value.page || 1;
  
  return cleanParams;
};

// Search function
const searchTradingCards = async () => {
  searchParams.value.page = 1; // Reset to first page when searching
  const cleanParams = getCleanParams();
  await cardStore.fetchTradingMarketplace(cleanParams);
};

// Reset search and fetch all cards
const resetSearch = async () => {
  searchParams.value = {
    name: '',
    type: '',
    rarity: '',
    set: '',
    username: '',
    orderBy: '',
    orderDirection: 'ASC',
    page: 1,
    limit: itemsPerPage.value
  };
  selectedColors.value = [];
  
  await cardStore.fetchTradingMarketplace({
    page: 1,
    limit: itemsPerPage.value
  });
};

// Pagination methods
const goToPage = async (page) => {
  const params = {
    ...getCleanParams(),
    page: page
  };
  await cardStore.fetchTradingMarketplace(params);
};

const goToFirstPage = () => {
  if (cardStore.tradingPagination.currentPage !== 1) {
    goToPage(1);
  }
};

const goToLastPage = () => {
  if (cardStore.tradingPagination.currentPage !== cardStore.tradingPagination.totalPages) {
    goToPage(cardStore.tradingPagination.totalPages);
  }
};

const goToNextPage = () => {
  if (cardStore.tradingPagination.currentPage < cardStore.tradingPagination.totalPages) {
    goToPage(cardStore.tradingPagination.currentPage + 1);
  }
};

const goToPrevPage = () => {
  if (cardStore.tradingPagination.currentPage > 1) {
    goToPage(cardStore.tradingPagination.currentPage - 1);
  }
};

const changeItemsPerPage = async () => {
  // Convert to number since v-model with select might give a string
  const limit = Number(itemsPerPage.value);
  searchParams.value.limit = limit;
  searchParams.value.page = 1; // Reset to page 1 when changing items per page
  
  const cleanParams = getCleanParams();
  await cardStore.fetchTradingMarketplace(cleanParams);
};
</script>
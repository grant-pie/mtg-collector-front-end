<template>
  <div>
    <!-- Search Form -->
    <div class="mb-6 bg-white p-4 rounded-lg shadow">
      <h3 class="text-lg font-medium mb-4">Search Cards</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Card Options</label>
          <div class="mt-1 flex items-center">
            <input 
              type="checkbox" 
              v-model="searchParams.hideBasicLands" 
              id="hideBasicLands"
              class="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <label for="hideBasicLands" class="ml-2 text-sm text-gray-700">Hide Basic Lands</label>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Willing to Trade</label>
          <input 
              type="radio" 
              value="true" 
              v-model="searchParams.willingToTrade" 
              name="willing_to_trade"
              class="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          <label for="true" class="ml-1">Willing</label>
          <input 
              type="radio" 
              value="false" 
              v-model="searchParams.willingToTrade" 
              name="willing_to_trade"
              class="ml-2 rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          <label for="false" class="ml-1">Unwilling</label>
          <input 
              type="radio" 
              value="" 
              v-model="searchParams.willingToTrade" 
              name="willing_to_trade"
              class="ml-2 rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          <label for="" class="ml-1">Any</label>
        </div>

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
        
        <!-- Add this to the search form grid, next to other filter options -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Revealed</label>
          <select 
            v-model="searchParams.revealed" 
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Any</option>
            <option value="true">Revealed</option>
            <option value="false">Not Revealed</option>
          </select>
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
          <label class="block text-sm font-medium text-gray-700">Mana Cost</label>
          <input 
            v-model="searchParams.manaCost" 
            type="text" 
            placeholder="e.g. {2}{W}{W}" 
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700">CMC</label>
          <input 
            v-model="searchParams.convertedManaCost" 
            type="number" 
            min="0" 
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700">Min Power</label>
          <input 
            v-model="searchParams.minPower" 
            type="number" 
            min="0" 
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700">Min Toughness</label>
          <input 
            v-model="searchParams.minToughness" 
            type="number" 
            min="0" 
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700">Card Text</label>
          <input 
            v-model="searchParams.text" 
            type="text" 
            placeholder="Search card text" 
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700">Artist</label>
          <input 
            v-model="searchParams.artist" 
            type="text" 
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700">Received On</label>
          <input 
            v-model="searchParams.createdAt" 
            type="date" 
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700">Received Between</label>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <input 
                v-model="searchParams.createdAtStart" 
                type="date" 
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="From"
              />
            </div>
            <div>
              <input 
                v-model="searchParams.createdAtEnd" 
                type="date" 
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="To"
              />
            </div>
          </div>
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
              <option value="createdAt">Received Date</option>
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
          @click="searchCards" 
          class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Search
        </button>
      </div>
    </div>
    
    <!-- Results Display -->
    <div v-if="loading" class="text-center py-10">
      <p>Loading cards...</p>
    </div>
    
    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      {{ error }}
    </div>
    
    <div v-else>
      <div class="mb-4 flex justify-between items-center">
        <h3 class="text-lg font-medium">Card List</h3>
        <p class="text-sm text-gray-600">
          Showing {{ pagination.itemCount }} of {{ pagination.totalItems }} cards
          (Page {{ pagination.currentPage }} of {{ pagination.totalPages }})
        </p>
      </div>
      
      <div v-if="cards.length === 0" class="text-center py-10">
        <p>No cards found matching your criteria.</p>
      </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="card in userCards" :key="card.id" class="relative">
        <CardItem 
          :card="card" 
          :userId="userId"
          :actions="cardActions"
          @onClickAction="emitOnClickAction" 
          @cardRevealed="handleCardRevealed"
          @cardUpdateWillingToTrade="handleCardUpdateWillingToTrade"
        />
        <div v-if="isCardInDeck(card)" class="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center">
          <p class="text-lg font-bold text-gray-800">Selected</p>
        </div>
      </div>
    </div>
      
      <!-- Pagination Controls -->
      <div v-if="pagination.totalPages > 1" class="mt-6 flex justify-center">
        <nav class="flex items-center space-x-2">
          <button 
            @click="goToFirstPage" 
            :disabled="pagination.currentPage === 1"
            class="px-3 py-1 rounded border" 
            :class="pagination.currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white hover:bg-gray-50'"
          >
            &laquo;
          </button>
          
          <button 
            @click="goToPrevPage" 
            :disabled="pagination.currentPage === 1"
            class="px-3 py-1 rounded border" 
            :class="pagination.currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white hover:bg-gray-50'"
          >
            &lsaquo;
          </button>
          
          <div class="flex space-x-1">
            <button 
              v-for="page in displayedPageNumbers" 
              :key="page" 
              @click="goToPage(page)"
              class="px-3 py-1 rounded border" 
              :class="page === pagination.currentPage ? 'bg-indigo-600 text-white' : 'bg-white hover:bg-gray-50'"
            >
              {{ page }}
            </button>
          </div>
          
          <button 
            @click="goToNextPage" 
            :disabled="pagination.currentPage === pagination.totalPages"
            class="px-3 py-1 rounded border" 
            :class="pagination.currentPage === pagination.totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white hover:bg-gray-50'"
          >
            &rsaquo;
          </button>
          
          <button 
            @click="goToLastPage" 
            :disabled="pagination.currentPage === pagination.totalPages"
            class="px-3 py-1 rounded border" 
            :class="pagination.currentPage === pagination.totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white hover:bg-gray-50'"
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
            @change.prevent="changeItemsPerPage($event)"
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
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useCardStore } from '~/stores/card';
import { storeToRefs } from 'pinia';
import CardItem from '~/components/Cards/CardItem.vue';

const props = defineProps({
  userName: {
    type: String,
    required: false
  },
  userId: {
    type: String,
    required: false
  },
  cardActions:{
    type: Array,
    required: false
  },
  excludeCards: {
    type: Array,
    required: false
  }
});

const emit = defineEmits(['onClickAction'])

const cardStore = useCardStore();
const { userCards, loading, error, pagination } = storeToRefs(cardStore);
const cards = computed(() => userCards.value);

const isCardInDeck = (card) => {
  if (!props.excludeCards) {
    return false;
  }
  
  const deckCardIds = props.excludeCards.map(deckCard => deckCard.id);
  return deckCardIds.includes(card.id);
};

// Search parameters
const searchParams = ref({
  name: '',
  type: '',
  rarity: '',
  set: '',
  manaCost: '',
  convertedManaCost: '',
  minPower: '',
  minToughness: '',
  text: '',
  createdAt: '',
  willingToTrade: '',
  createdAtStart: '',
  createdAtEnd: '',
  orderBy: '',
  orderDirection: 'ASC',
  hideBasicLands: true, // Added this line with default value of true
  page: 1,
  limit: 10
});

// Pagination state
const itemsPerPage = ref(10);

// Selected colors for checkbox handling
const selectedColors = ref([]);
const selectedUsername = computed(() => {
  return props.userName;
});

// Calculate displayed page numbers
const displayedPageNumbers = computed(() => {
  const totalPages = pagination.value.totalPages;
  const currentPage = pagination.value.currentPage;
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

watch(selectedUsername, async () => {
  if (props.userName) {
    searchParams.value.page = 1;
    await cardStore.fetchCardsByUsername(props.userName, { 
      page: searchParams.value.page, 
      limit: itemsPerPage.value 
    });
  }
});

// Watch for changes in selectedColors to update searchParams
watch(selectedColors, (newColors) => {
  searchParams.value.colors = newColors.length > 0 ? newColors : undefined;
});

// Watch for changes in date range to clear single date
watch(() => [searchParams.value.createdAtStart, searchParams.value.createdAtEnd], ([start, end]) => {
  if (start || end) {
    searchParams.value.createdAt = '';
  }
});

// Watch for changes in single date to clear date range
watch(() => searchParams.value.createdAt, (newDate) => {
  if (newDate) {
    searchParams.value.createdAtStart = '';
    searchParams.value.createdAtEnd = '';
  }
});

// Format dates to yyyy-mm-dd format for API
const formatDateForApi = (dateString) => {
  if (!dateString) return '';
  
  // HTML date inputs return YYYY-MM-DD format which is what we want
  return dateString;
};

// Load cards on component mount
onMounted(async () => {
  if (props.userId) {
    await cardStore.fetchUserCards(props.userId, 1, itemsPerPage.value, { hideBasicLands: true });
  }

  if (props.userName) {
    await cardStore.fetchCardsByUsername(props.userName, { 
      page: 1, 
      limit: itemsPerPage.value,
      hideBasicLands: true // Apply filtering by default
    });
  }
});;

// Refetch cards when userId changes
watch(() => props.userId, async (newUserId) => {
  if (newUserId) {
    resetSearch();
    await cardStore.fetchUserCards(newUserId, 1, itemsPerPage.value);
  }
});

// Pagination methods
const goToPage = async (page) => {
  // Create fresh params with explicit limit
  const params = {
    ...getCleanParams(),
    page: page,
    limit: itemsPerPage.value // Explicitly set the limit
  };
  
  if (props.userId) {
    await cardStore.searchUserCards(props.userId, params);
  } else if (props.userName) {
    await cardStore.fetchCardsByUsername(props.userName, params);
  }
};

const goToFirstPage = () => {
  if (pagination.value.currentPage !== 1) {
    goToPage(1);
  }
};

const goToLastPage = () => {
  if (pagination.value.currentPage !== pagination.value.totalPages) {
    goToPage(pagination.value.totalPages);
  }
};

const goToNextPage = async () => {
  if (pagination.value.currentPage < pagination.value.totalPages) {
    const nextPage = pagination.value.currentPage + 1;
    
    // Create fresh params with explicit limit
    const params = {
      ...getCleanParams(),
      page: nextPage,
      limit: itemsPerPage.value // Explicitly set the limit
    };
    
    if (props.userId) {
      await cardStore.searchUserCards(props.userId, params);
    } else if (props.userName) {
      await cardStore.fetchCardsByUsername(props.userName, params);
    }
  }
};

// Update the goToPrevPage method similarly
const goToPrevPage = async () => {
  if (pagination.value.currentPage > 1) {
    const prevPage = pagination.value.currentPage - 1;
    
    // Create fresh params with explicit limit
    const params = {
      ...getCleanParams(),
      page: prevPage,
      limit: itemsPerPage.value // Explicitly set the limit
    };
    
    if (props.userId) {
      await cardStore.searchUserCards(props.userId, params);
    } else if (props.userName) {
      await cardStore.fetchCardsByUsername(props.userName, params);
    }
  }
};

const changeItemsPerPage = async (event) => {
  // Prevent default form submission behavior if an event was passed
  if (event) event.preventDefault();
  
  // Convert to number since v-model with select might give a string
  const limit = Number(itemsPerPage.value);
  searchParams.value.limit = limit;
  searchParams.value.page = 1; // Reset to page 1 when changing items per page
  
  // Get clean search parameters
  const cleanParams = getCleanParams();
  
  // Use the store's changeItemsPerPage method which has been updated to use useFetch
  try {
    if (props.userId) {
      await cardStore.changeItemsPerPage(props.userId, limit, cleanParams);
    } else if (props.userName) {
      // Handle username case specifically - we need to extract username
      await cardStore.fetchCardsByUsername(props.userName, cleanParams);
    }
  } catch (error) {
    console.error("Error changing items per page:", error);
  }
};

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
  
  // Format dates for API
  if (cleanParams.createdAt) {
    cleanParams.createdAt = formatDateForApi(cleanParams.createdAt);
  }
  
  if (cleanParams.createdAtStart) {
    cleanParams.createdAtStart = formatDateForApi(cleanParams.createdAtStart);
  }
  
  if (cleanParams.createdAtEnd) {
    cleanParams.createdAtEnd = formatDateForApi(cleanParams.createdAtEnd);
  }
  
  // IMPORTANT: Explicitly set the limit to the current itemsPerPage value
  cleanParams.limit = itemsPerPage.value;
  cleanParams.page = searchParams.value.page || 1;
  
  return cleanParams;
};

// Perform search with current parameters
const performSearch = async () => {
  const cleanParams = getCleanParams();
  // Explicitly ensure limit is set correctly
  cleanParams.limit = itemsPerPage.value;
  
  if (props.userId) {
    await cardStore.searchUserCards(props.userId, cleanParams);
  } else if (props.userName) {
    await cardStore.fetchCardsByUsername(props.userName, cleanParams);
  }
};

// Search function
const searchCards = async () => {
  searchParams.value.page = 1;  // Reset to first page when searching
  await performSearch();
};

// Reset search and fetch all cards
const resetSearch = async () => {
  searchParams.value = {
    name: '',
    type: '',
    rarity: '',
    set: '',
    manaCost: '',
    convertedManaCost: '',
    minPower: '',
    minToughness: '',
    text: '',
    artist: '',
    willingToTrade: '',
    createdAt: '',
    createdAtStart: '',
    createdAtEnd: '',
    orderBy: '',
    orderDirection: 'ASC',
    hideBasicLands: true, // Keep this enabled by default on reset
    page: 1,
    limit: itemsPerPage.value
  };
  selectedColors.value = [];
  
  if (props.userId) {
    await cardStore.fetchUserCards(props.userId, 1, itemsPerPage.value);
  } else if (props.userName) {
    await cardStore.fetchCardsByUsername(props.userName, { 
      page: 1, 
      limit: itemsPerPage.value,
      hideBasicLands: true // Also pass this parameter on initial fetch
    });
  }
};

const emitOnClickAction = async (actionAndCardObj) => {
  const { action, card } = actionAndCardObj;
  
  try {
    // Check if we're revealing a card
    if (action === 'Reveal') {
      // Call the revealCard method with the right IDs
      const updatedCard = await cardStore.revealCard(card.id, props.userId || card.userId);
      
      // If the response doesn't have complete card details, refresh the full list
      if (!updatedCard || !updatedCard.cardDetails) {
        await performSearch();
      }
    } 
    // Check if we're toggling trade status
    else if (action === 'Willing To Trade' || action === 'Unwilling to Trade') {
      const updatedCard = await cardStore.setWillingToTrade(
        card.id, 
        props.userId || card.userId, 
        card.willingToTrade
      );
      
      // If the response doesn't have complete card details, refresh the full list
      if (!updatedCard || !updatedCard.cardDetails) {
        await performSearch();
      }
    } 
    // For other actions, pass through to parent
    else {
      emit('onClickAction', actionAndCardObj);
    }
  } catch (error) {
    console.error(`Error processing action ${action}:`, error);
    // On error, refresh the list to ensure we have the latest state
    await performSearch();
  }
};

// Add event handlers for CardItem events
const handleCardRevealed = (updatedCard) => {
  console.log('Card revealed:', updatedCard.id);
};

const handleCardUpdateWillingToTrade = (updatedCard) => {
  console.log('Card trading status updated:', updatedCard.id);
};
</script>
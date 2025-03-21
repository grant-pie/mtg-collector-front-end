<template>
  <div>
    <!-- Search Form -->
    <div class="mb-6 bg-white p-4 rounded-lg shadow">
      <h3 class="text-lg font-medium mb-4">Search Cards</h3>
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
        <p class="text-sm text-gray-600">{{ cards.length }} cards found</p>
      </div>
      
      <div v-if="cards.length === 0" class="text-center py-10">
        <p>No cards found matching your criteria.</p>
      </div>
      
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <CardItem 
          v-for="card in cards" 
          :key="card.id" 
          :card="card" 
          :userId="userId"
          :userIsAdmin="true"
        />
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
  }
});

const cardStore = useCardStore();
const { userCards, loading, error } = storeToRefs(cardStore);
const cards = computed(() => userCards.value);

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
  artist: '',
  createdAt: '',
  createdAtStart: '',
  createdAtEnd: '',
  orderBy: '',
  orderDirection: 'ASC'
});

// Selected colors for checkbox handling
const selectedColors = ref([]);
const selectedUsername = computed(() => {
  return props.userName;
});

watch(selectedUsername, async ()=> {
  await cardStore.fetchCardsByUsername(props.userName);
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
  if(props.userId != null && props.userId != '' && props.userId != undefined){
    await cardStore.fetchUserCards(props.userId);
  }

  if(props.userName != null && props.userName != '' && props.userName != undefined){
    await cardStore.fetchCardsByUsername(props.userName);
  }
});

// Refetch cards when userId changes
watch(() => props.userId, async (newUserId) => {
  resetSearch();
  await cardStore.fetchUserCards(newUserId);
});

// Search function
const searchCards = async () => {
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
  
 
  if(props.userId != null && props.userId != '' && props.userId != undefined){
    await cardStore.searchUserCards(props.userId, cleanParams);
  }

  if(props.userName != null && props.userName != '' && props.userName != undefined){
    await cardStore.fetchCardsByUsername(props.userName, cleanParams);
  }
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
    createdAt: '',
    createdAtStart: '',
    createdAtEnd: '',
    orderBy: '',
    orderDirection: 'ASC'
  };
  selectedColors.value = [];
  
  if(props.userId != null && props.userId != '' && props.userId != undefined){
    await cardStore.fetchUserCards(props.userId);
  }

  if(props.userName != null && props.userName != '' && props.userName != undefined){
    await cardStore.fetchCardsByUsername(props.userName);
  }

  
};
</script>
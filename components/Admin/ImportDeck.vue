<template>
    <div class="bg-white p-6 rounded shadow-md">
      <h2 class="text-2xl font-bold mb-4">Import Deck</h2>
      
      <div v-if="!isAdmin" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        Only administrators can import decks.
      </div>
      
      <div v-else>
        <div class="mb-4">
          <label for="deckName" class="block text-gray-700 mb-2">Deck Name</label>
          <input
            v-model="deckName"
            id="deckName"
            type="text"
            class="w-full p-2 border rounded"
            placeholder="Enter deck name"
            :disabled="loading"
          />
        </div>
        
        <div class="mb-4">
          <label for="deckList" class="block text-gray-700 mb-2">Deck List</label>
          <textarea 
            v-model="deckListText"
            id="deckList" 
            class="w-full p-2 border rounded h-40"
            placeholder="Paste deck list here (e.g. 'Lands (18)\n5 Mountain\n12 Plains')"
            :disabled="loading"
          ></textarea>
          <p class="text-sm text-gray-500 mt-1">
            Format: Category headers like "Lands (18)", followed by "Quantity Card Name" on each line.
          </p>
        </div>
        
        <div class="flex gap-2 mb-4">
          <button 
            @click="parseDeckList"
            class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            :disabled="loading || !deckListText || !deckName"
          >
            Parse Deck List
          </button>
          
          <button 
            v-if="parsedCards.length > 0 && !allCardsHaveScryfallId"
            @click="fetchScryfallIds"
            class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
            :disabled="fetchingIds || allCardsHaveScryfallId"
          >
            {{ fetchingIds ? `Fetching IDs (${fetchProgress}/${parsedCards.length})` : 'Fetch Scryfall IDs' }}
          </button>
          
          <button 
            v-if="parsedCards.length > 0 && allCardsHaveScryfallId && !errorInCards"
            @click="createDeckWithCards"
            class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            :disabled="creatingDeck"
          >
            {{ creatingDeck ? 'Creating Deck...' : 'Create Deck' }}
          </button>
        </div>
        
        <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {{ error }}
        </div>
        
        <div v-if="success" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {{ success }}
        </div>
        
        <div v-if="parsedCards.length > 0" class="mt-4">
          <h3 class="text-xl font-semibold mb-3">Parsed Cards ({{ parsedCards.length }} total)</h3>
          
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Card Name</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scryfall ID</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(card, index) in parsedCards" :key="index">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ card.name }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ card.category }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ card.qty }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span v-if="card.scryfallId">{{ card.scryfallId }}</span>
                    <span v-else-if="card.scryfallIdError" class="text-red-500">Error: {{ card.scryfallIdError }}</span>
                    <span v-else>-</span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span v-if="card.added && card.addedToDeck" class="text-green-500">Added to Collection & Deck</span>
                    <span v-else-if="card.added" class="text-green-500">Added to Collection</span>
                    <span v-else-if="card.scryfallIdError" class="text-red-500">Error</span>
                    <span v-else-if="card.scryfallId">Ready</span>
                    <span v-else class="text-gray-400">Pending</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useAuthStore } from '~/stores/auth';
  import { useCardStore } from '~/stores/card';
  import { useDeckStore } from '~/stores/deck';
  
  const props = defineProps({
    userId: {
      type: String,
      required: true
    }
  });
  
  const authStore = useAuthStore();
  const cardStore = useCardStore();
  const deckStore = useDeckStore();
  
  interface ParsedCard {
    name: string;
    category: string;
    qty: number;
    scryfallId?: string;
    scryfallIdError?: string;
    added?: boolean;
    addedToDeck?: boolean;
  }
  
  const isAdmin = computed(() => authStore.isAdmin);
  const deckName = ref('');
  const deckListText = ref('');
  const parsedCards = ref<ParsedCard[]>([]);
  const loading = ref(false);
  const fetchingIds = ref(false);
  const fetchProgress = ref(0);
  const error = ref<string | null>(null);
  const success = ref<string | null>(null);
  const creatingDeck = ref(false);
  
  const allCardsHaveScryfallId = computed(() => {
    return parsedCards.value.length > 0 && 
           parsedCards.value.every(card => card.scryfallId || card.scryfallIdError);
  });
  
  const errorInCards = computed(() => {
    return parsedCards.value.some(card => card.scryfallIdError);
  });
  
  const getToday = function formatDate(date = new Date()) {
    // Get year, month, day
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    
    // Get hours and minutes
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    // Return formatted string
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

  const parseDeckList = () => {
    if (!deckListText.value || !deckName.value || loading.value) return;
    
    loading.value = true;
    error.value = null;
    success.value = null;
    parsedCards.value = [];
    
    try {
      // Split by new lines and filter out empty lines
      const lines = deckListText.value.split('\n').filter(line => line.trim());
      
      let currentCategory = '';
      
      for (const line of lines) {
        // Check if the line is a category header (can be with or without asterisks)
        // Match patterns like "Lands (18)" or "**Lands (18)**"
        const categoryMatch = line.match(/^\**\s*(\w+)\s*\((\d+)\)\s*\**$/);
        
        if (categoryMatch) {
          currentCategory = categoryMatch[1].trim();
          continue;
        }
        
        // Parse card line - expecting format like "2 Serra Angel"
        const cardMatch = line.match(/^(\d+)\s+(.+)$/);
        
        if (cardMatch && currentCategory) {
          const [_, qty, name] = cardMatch;
          parsedCards.value.push({
            name: name.trim(),
            category: currentCategory,
            qty: parseInt(qty.trim(), 10)
          });
        }
      }
      
      if (parsedCards.value.length === 0) {
        error.value = "No valid card entries found. Please check your format.";
      }
      
    } catch (err: any) {
      console.error('Error parsing deck list:', err);
      error.value = err.message || 'Failed to parse deck list';
    } finally {
      loading.value = false;
    }
  };
  
  const fetchScryfallIds = async () => {
    if (fetchingIds.value) return;
    
    fetchingIds.value = true;
    fetchProgress.value = 0;
    error.value = null;
    
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    
    try {
      for (let i = 0; i < parsedCards.value.length; i++) {
        const card = parsedCards.value[i];
        
        if (!card.scryfallId && !card.scryfallIdError) {
          try {
            // Replace spaces with %20 for the API call
            const encodedName = encodeURIComponent(card.name);
            const response = await fetch(`https://api.scryfall.com/cards/named?exact=${encodedName}`);
            
            if (!response.ok) {
              throw new Error(`Card not found: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (data.id) {
              card.scryfallId = data.id;
            } else {
              card.scryfallIdError = "No scryfall ID available";
            }
          } catch (err: any) {
            console.error(`Error fetching scryfall ID for ${card.name}:`, err);
            card.scryfallIdError = err.message || "Failed to fetch ID";
          }
          
          fetchProgress.value = i + 1;
          
          // Delay to avoid rate limiting (100ms between requests)
          await delay(100);
        }
      }
    } catch (err: any) {
      console.error('Error in fetch process:', err);
      error.value = err.message || 'Failed to fetch all multiverse IDs';
    } finally {
      fetchingIds.value = false;
    }
  };
  
  const createDeckWithCards = async () => {
    if (creatingDeck.value || !deckName.value) return;
    
    creatingDeck.value = true;
    error.value = null;
    success.value = null;

    const userAddedCards = [];
    try {
      // 1. First, add all cards to the user's collection
      for (const card of parsedCards.value) {
        if (card.scryfallId) {
          try {
            // For each card, add it to the user's collection according to its quantity
            for (let i = 0; i < card.qty; i++) {
              const userAddedCard = await cardStore.addCardToUser(props.userId, card.scryfallId) || {};
              userAddedCards.push(userAddedCard);
            }
            card.added = true;
          } catch (err: any) {
            console.error(`Error adding card ${card.name} to user's collection:`, err);
            card.scryfallIdError = err.message || "Failed to add to collection";
          }
        }
 
    
      }

   
      // 2. Create a new deck
      const newDeck = await deckStore.createDeckForUser({
        name: deckName.value,
        description: `Imported on ${getToday()}`
      }, props.userId);

      // 3. Add all cards to the deck
      for (const card of userAddedCards) {
        console.log(card);
        try {
          // For each card, add it to the deck according to its quantity
          console.log('attempting to add card to deck');
          await deckStore.addUserCardToDeckForUser(props.userId, newDeck.id, card.userCard.id);
        } catch (err: any) {

          console.error(`Error adding card ${card.name} to deck:`, err);
          
        }
      }
      
      // 4. Refresh the user's card collection
      await cardStore.fetchUserCards(props.userId);
      
      success.value = `Successfully added cards to collection and created deck "${deckName.value}" with ${parsedCards.value.length} cards!`;
      deckName.value = '';
      deckListText.value = '';
      
    } catch (err: any) {
      console.error('Error creating deck:', err);
      error.value = err.message || 'Failed to create deck';
    } finally {
      creatingDeck.value = false;
    }
  };
  </script>
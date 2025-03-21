<template>
  <div class="bg-white p-6 rounded shadow-md">
    <h2 class="text-2xl font-bold mb-4">Import Cards from Text</h2>
    
    <div v-if="!isAdmin" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      Only administrators can import cards.
    </div>
    
    <div v-else>
      <div class="mb-4">
        <label for="cardList" class="block text-gray-700 mb-2">Card List</label>
        <textarea 
          v-model="cardListText"
          id="cardList" 
          class="w-full p-2 border rounded h-40"
          placeholder="Paste card list here (e.g. '1 Card Name [SET]')"
          :disabled="loading"
        ></textarea>
        <p class="text-sm text-gray-500 mt-1">
          Format: Quantity Card Name [Set Code]. One card per line.
        </p>
      </div>
      
      <div class="flex gap-2 mb-4">
        <button 
          @click="parseCardList"
          class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          :disabled="loading || !cardListText"
        >
          Parse Card List
        </button>
        
        <button 
          v-if="parsedCards.length > 0 && !allCardsHaveScryfallId"
          @click="fetchScryfallIdsAndAddCards"
          class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
          :disabled="fetchingIds || importing"
        >
          {{ fetchingIds ? `Processing (${fetchProgress}/${parsedCards.length})` : 'Import Cards' }}
        </button>
      </div>
      
      <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {{ error }}
      </div>
      
      <div v-if="successMessage" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
        {{ successMessage }}
      </div>
      
      <div v-if="parsedCards.length > 0" class="mt-4">
        <h3 class="text-xl font-semibold mb-3">Parsed Cards</h3>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Card Name</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Set</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scryfall ID</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(card, index) in parsedCards" :key="index">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ card.name }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ card.set }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ card.qty }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span v-if="card.scryfallId">{{ card.scryfallId }}</span>
                  <span v-else-if="card.scryfallIdError" class="text-red-500">Error: {{ card.scryfallIdError }}</span>
                  <span v-else>-</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span v-if="card.added" class="text-green-500">Added</span>
                  <span v-else-if="card.adding" class="text-blue-500">Adding...</span>
                  <span v-else-if="card.addError" class="text-red-500">Error: {{ card.addError }}</span>
                  <span v-else-if="!card.scryfallId" class="text-gray-400">Need ID</span>
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

const props = defineProps({
  userId: {
    type: String,
    required: true
  }
});

const authStore = useAuthStore();
const cardStore = useCardStore();

interface ParsedCard {
  name: string;
  set: string;
  qty: number;
  scryfallId?: string;
  scryfallIdError?: string;
  adding?: boolean;
  added?: boolean;
  addError?: string;
}

const isAdmin = computed(() => authStore.isAdmin);
const cardListText = ref('');
const parsedCards = ref<ParsedCard[]>([]);
const loading = ref(false);
const fetchingIds = ref(false);
const importing = ref(false);
const fetchProgress = ref(0);
const error = ref<string | null>(null);
const successMessage = ref<string | null>(null);

const allCardsHaveScryfallId = computed(() => {
  return parsedCards.value.length > 0 && 
         parsedCards.value.every(card => card.scryfallId || card.scryfallIdError);
});

const parseCardList = () => {
  if (!cardListText.value || loading.value) return;
  
  loading.value = true;
  error.value = null;
  successMessage.value = null;
  parsedCards.value = [];
  
  try {
    // Split by new lines and filter out empty lines
    const lines = cardListText.value.split('\n').filter(line => line.trim());
    
    for (const line of lines) {
      // Parse line using regex to extract qty, name, and set
      const match = line.match(/^(\d+)\s+(.*?)\s+\[(\w+)\]\.?$/);
      
      if (match) {
        const [_, qty, name, set] = match;
        parsedCards.value.push({
          name: name.trim(),
          set: set.trim(),
          qty: parseInt(qty.trim(), 10)
        });
      }
    }
    
    if (parsedCards.value.length === 0) {
      error.value = "No valid card entries found. Please check your format.";
    }
    
  } catch (err: any) {
    console.error('Error parsing card list:', err);
    error.value = err.message || 'Failed to parse card list';
  } finally {
    loading.value = false;
  }
};

const fetchScryfallIdsAndAddCards = async () => {
  if (fetchingIds.value || importing.value) return;
  
  fetchingIds.value = true;
  importing.value = true;
  fetchProgress.value = 0;
  error.value = null;
  successMessage.value = null;
  
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  let addedCount = 0;
  let failedCount = 0;
  
  try {
    for (let i = 0; i < parsedCards.value.length; i++) {
      const card = parsedCards.value[i];
      
      // First, get the Scryfall ID if it doesn't exist
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
            card.scryfallId = data.id.toString();
          } else {
            card.scryfallIdError = "No scryfall ID available";
            failedCount++;
          }
        } catch (err: any) {
          console.error(`Error fetching scryfall ID for ${card.name}:`, err);
          card.scryfallIdError = err.message || "Failed to fetch ID";
          failedCount++;
        }
        
        // Delay to avoid rate limiting (100ms between requests)
        await delay(100);
      }
      
      // Now add the card to the user if we have an ID
      if (card.scryfallId && !card.added && !card.addError) {
        card.adding = true;
        
        try {
          // If quantity is greater than 1, we need to add the card multiple times
          for (let j = 0; j < card.qty; j++) {
            await cardStore.addCardToUser(props.userId, card.scryfallId);
            
            // Small delay between requests if adding multiple copies
            if (card.qty > 1 && j < card.qty - 1) {
              await delay(100);
            }
          }
          
          // Mark the card as successfully added
          card.added = true;
          card.adding = false;
          addedCount += card.qty;
        } catch (err: any) {
          console.error(`Error adding ${card.name} to user:`, err);
          card.addError = err.message || 'Failed to add card';
          card.adding = false;
          failedCount++;
        }
      }
      
      fetchProgress.value = i + 1;
    }
    
    // Set a success message
    if (addedCount > 0) {
      successMessage.value = `Successfully added ${addedCount} card${addedCount !== 1 ? 's' : ''} to the user's collection.`;
      if (failedCount > 0) {
        successMessage.value += ` Failed to add ${failedCount} card${failedCount !== 1 ? 's' : ''}.`;
      }
    } else if (failedCount > 0) {
      error.value = `Failed to add ${failedCount} card${failedCount !== 1 ? 's' : ''} to the user's collection.`;
    }
    
  } catch (err: any) {
    console.error('Error in import process:', err);
    error.value = err.message || 'Failed to import cards';
  } finally {
    fetchingIds.value = false;
    importing.value = false;
  }
};
</script>
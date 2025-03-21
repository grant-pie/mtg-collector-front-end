<template>
  <div>
    <Header 
      :title="deck ? deck.name : 'Deck Details'" 
      :subtitle="deck ? deck.description : 'Loading...'"
    />
    
    <div v-if="!isAuthenticated" class="text-center py-10">
      <p>Please log in to view deck details.</p>
      <LoginButton class="mt-4" />
    </div>
    
    <div v-else-if="deckStore.loading" class="text-center py-10">
      <p>Loading deck...</p>
    </div>
    
    <div v-else-if="deckStore.error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-4">
      <p>{{ deckStore.error }}</p>
    </div>
    
    <div v-else-if="!deck" class="text-center py-10">
      <p>Deck not found.</p>
      <NuxtLink to="/decks" class="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
        Back to Decks
      </NuxtLink>
    </div>
    
    <div v-else class="mt-8">

      <!--deck overview-->
      <div class="flex justify-between">
        <h2 class="text-2xl font-bold">Deck Overview</h2>
        <button 
          id="copyDeckListBtn"
          @click="copyDeckList()" 
          class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
          >
            Copy Decklist
          </button>
      </div>
      <div class="flex mb-6 mt-5 bg-white shadow rounded p-4">

        <div id="deckList"
        v-html="deckListHtml"
        ></div>


      </div>

      <!-- end deck overview -->
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold">Cards in this Deck</h2>
        <button 
          @click="showAddCardModal = true" 
          class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
        >
          Add Cards
        </button>
      </div>
      
      <!-- Search bar -->
      <div class="mb-6 bg-white shadow rounded p-4">
        <div class="mb-4">
          <label class="block text-gray-700 mb-2" for="search">Search Cards</label>
          <input 
            id="search" 
            v-model="searchQuery" 
            type="text" 
            placeholder="Search by card name..."
            class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-gray-700 mb-2" for="type">Type</label>
            <select 
              id="type" 
              v-model="selectedType" 
              class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              <option v-for="type in availableTypes" :key="type" :value="type">{{ type }}</option>
            </select>
          </div>
          
          <div>
            <label class="block text-gray-700 mb-2" for="rarity">Rarity</label>
            <select 
              id="rarity" 
              v-model="selectedRarity" 
              class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Rarities</option>
              <option v-for="rarity in availableRarities" :key="rarity" :value="rarity">{{ rarity }}</option>
            </select>
          </div>
          
          <div>
            <label class="block text-gray-700 mb-2" for="color">Color</label>
            <select 
              id="color" 
              v-model="selectedColor" 
              class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Colors</option>
              <option v-for="color in availableColors" :key="color.code" :value="color.code">{{ color.name }}</option>
            </select>
          </div>
          
          <div class="flex items-end">
            <button 
              @click="resetFilters" 
              class="w-full px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>
      
      <!-- Cards in the deck -->
      <div v-if="filteredCards.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="card in filteredCards" :key="card.id" class="bg-white shadow rounded p-4 flex justify-between">
          <div>
            <h3 class="font-bold">{{ card.card.name }}</h3>
            <p class="text-sm text-gray-600">{{ card.card.type }} • {{ card.card.rarity }}</p>
            <div class="flex space-x-1 mt-1">
              <span v-for="(color, index) in card.card.colors" :key="index" 
                class="w-5 h-5 rounded-full" 
                :class="getColorClass(color)"
                :title="getColorName(color)">
              </span>
            </div>
            <div class="mt-2">
              <img 
                :src="`${card.card.imageUrl}`" 
                :alt="`Card ${card.multiverseId || (card.cardDetails && card.cardDetails.multiverseId)}`"
                class="w-40"
              />
            </div>
            <div class="mt-2">{{`${card.card.text}`}}</div>
          </div>
          <button 
            @click="removeCardFromDeck(card.id)" 
            class="h-8 px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Remove
          </button>
        </div>
      </div>
      
      <div v-else-if="deck.userCards && deck.userCards.length > 0" class="text-center py-10 bg-gray-50 rounded">
        <p class="text-gray-600">No cards match your search criteria.</p>
        <button 
          @click="resetFilters" 
          class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Reset Filters
        </button>
      </div>
      
      <div v-else class="text-center py-10 bg-gray-50 rounded">
        <p class="text-gray-600">This deck has no cards yet.</p>
        <button 
          @click="showAddCardModal = true" 
          class="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
        >
          Add Your First Card
        </button>
      </div>
    </div>
    
    <!-- Add Card Modal -->
    <div v-if="showAddCardModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl h-3/4 flex flex-col">
        <h3 class="text-xl font-bold mb-4">Add Cards to Deck</h3>
        
        <div class="flex-grow overflow-y-auto">
          <UserCardsList 
          :userId="user?.id"
          :cardActions="['Add To Deck']"
          :excludeCards="deck.userCards"
          @onClickAction="onClickAction"
          />

        </div>  
        
        <div class="mt-4 pt-4 border-t flex justify-end">
          <button 
            @click="showAddCardModal = false" 
            class="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '~/stores/auth';
import { useDeckStore } from '~/stores/deck';
import { useCardStore } from '~/stores/card';
import Header from '~/components/Layout/Header.vue';
import LoginButton from '~/components/Auth/LoginButton.vue';
import UserCardsList from '~/components/User/UserCardsList.vue';


definePageMeta({
  middleware: ['auth']
});

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const deckStore = useDeckStore();
const cardStore = useCardStore();

const { isAuthenticated, user } = storeToRefs(authStore);
const showAddCardModal = ref(false);

// Search and filter states for deck cards
const searchQuery = ref('');
const selectedType = ref('');
const selectedRarity = ref('');
const selectedColor = ref('');

// Search and filter states for modal (available cards)
const modalSearchQuery = ref('');
const modalSelectedType = ref('');
const modalSelectedRarity = ref('');
const modalSelectedColor = ref('');

// Get deck details
const deckId = computed(() => route.params.id);
const deck = computed(() => deckStore.currentDeck);

const deckListHtml = computed(() => {
  if (!deck.value || !deck.value.userCards || deck.value.userCards.length === 0) return '';
  
  // Check if the first card has valid structure
  if (!deck.value.userCards[0] || !deck.value.userCards[0].card) return '';

  let html = '';
  let landHtml = '';
  let artifactHtml = ``;
  let enchantmentHtml = ``;
  let instantHtml = ``;
  let sorceryHtml = ``;
  let creatureHtml = ``;
  let landCount = 0;
  let artifactCount = 0;
  let enchantmentCount = 0;
  let sorceryCount = 0;
  let instantCount = 0;
  let creatureCount = 0;
  let cardCount = [{
    name: '',
    type: ''
  }];
  for (const card of deck.value.userCards) {

    if(card.card){
      if(!cardCount.some(obj => obj.name === card.card.name)){
          cardCount.push({
            name: card.card.name,
            type: card.card.type,
            count: 1
          });
        } else {
          const foundObject = cardCount.find(obj => obj.name === card.card.name);
          foundObject.count++
      }
    }

  }

  for(const card of cardCount) {

    if(card.type.includes("Land")){

      landCount += card.count;
      landHtml += `<p>${card.name} (${card.count})</p>`;

    }

    if(card.type.includes("Artifact")){

      artifactCount += card.count;
      artifactHtml += `<p>${card.name} (${card.count})</p>`;

    }

    if(card.type.includes("Enchantment")){

      enchantmentCount += card.count;
      enchantmentHtml += `<p>${card.name} (${card.count})</p>`;;

    }

    if(card.type.includes("Instant")){

      instantCount+= card.count;
      instantHtml += `<p>${card.name} (${card.count})</p>`;

    }

    if(card.type.includes("Sorcery")){

      sorceryCount += card.count;
      sorceryHtml += `<p>${card.name} (${card.count})</p>`;

    }

    if(card.type.includes("Creature")){

      creatureCount += card.count;
      creatureHtml += `<p>${card.name} (${card.count})</p>`;

   
    }
  
  }

  html += `<strong> Lands (${landCount}) </strong><br>`;
  html += landHtml + `<br>`;

  html += `<strong> Artifacts (${artifactCount}) </strong><br>`;
  html += artifactHtml + `<br>`;

  html += `<strong> Enchantments(${enchantmentCount}) </strong><br>`;
  html += enchantmentHtml+  `<br>`;

  html += `<strong> Instants (${instantCount}) </strong><br>`;
  html += instantHtml + `<br>`;

  html += `<strong> Sorcery (${sorceryCount}) </strong><br>`;
  html += sorceryHtml + `<br>`;

  html += `<strong> Creature (${creatureCount}) </strong><br>`;
  html += creatureHtml + `<br>`;
  return html
});


// Color mapping
const colorMap = [
  { code: 'W', name: 'White', class: 'bg-yellow-100 border border-yellow-400' },
  { code: 'U', name: 'Blue', class: 'bg-blue-500' },
  { code: 'B', name: 'Black', class: 'bg-gray-800' },
  { code: 'R', name: 'Red', class: 'bg-red-600' },
  { code: 'G', name: 'Green', class: 'bg-green-600' }
];

// Get filter options from cards in deck
const availableTypes = computed(() => {
  if (!deck.value || !deck.value.userCards || deck.value.userCards.length === 0) return [];
  
  // Only map cards that have the 'card' property defined
  const types = deck.value.userCards
    .filter(card => card.card && card.card.type)
    .map(card => card.card.type.split(' ')[0]); // Get primary type
  
  return [...new Set(types)].sort();
});

const availableRarities = computed(() => {
  if (!deck.value || !deck.value.userCards || deck.value.userCards.length === 0) return [];
  
  const rarities = deck.value.userCards
    .filter(card => card.card && card.card.rarity)
    .map(card => card.card.rarity);
    
  return [...new Set(rarities)].sort();
});

const availableColors = computed(() => {
  return colorMap;
});

// Get filter options from available cards (for modal)
const modalAvailableTypes = computed(() => {
  if (!availableCards.value) return [];
  const types = availableCards.value.map(card => {
    const typeParts = card.cardDetails.type.split(' ');
    return typeParts[0]; // Get primary type
  });
  return [...new Set(types)].sort();
});

const modalAvailableRarities = computed(() => {
  if (!availableCards.value) return [];
  const rarities = availableCards.value.map(card => card.cardDetails.rarity);
  return [...new Set(rarities)].sort();
});

// Filter cards in deck based on search and filters
const filteredCards = computed(() => {
  if (!deck.value || !deck.value.userCards || deck.value.userCards.length === 0) return [];

  return deck.value.userCards.filter(card => {
    // Add a safety check to ensure card and card.card exists
    if (!card || !card.card) return false;
    
    // Filter by search query
    const nameMatch = card.card.name && card.card.name.toLowerCase().includes(searchQuery.value.toLowerCase());
    
    // Filter by type
    const typeMatch = !selectedType.value || 
      (card.card.type && card.card.type.toLowerCase().includes(selectedType.value.toLowerCase()));
    
    // Filter by rarity
    const rarityMatch = !selectedRarity.value || 
      (card.card.rarity && card.card.rarity.toLowerCase() === selectedRarity.value.toLowerCase());
    
    // Filter by color
    const colorMatch = !selectedColor.value || 
      (card.card.colors && card.card.colors.includes(selectedColor.value));
    
    return nameMatch && typeMatch && rarityMatch && colorMatch;
  });
});

// Get available cards (user's cards not already in deck)
const availableCards = computed(() => {
  if (!deck.value || !deck.value.userCards) {
    return cardStore.userCards || [];
  }
  
  // Get all user cards
  const allCards = cardStore.userCards || [];
 
  // Filter out cards already in the deck
  // Make sure we're comparing the right IDs
  const deckCardIds = deck.value.userCards.map(card => card.id);

  return allCards.filter(card => !deckCardIds.includes(card.id));
});

// Filter available cards based on modal search and filters
const filteredAvailableCards = computed(() => {
  if (!availableCards.value) return [];
  
  return availableCards.value.filter(card => {
    // Filter by search query
    const nameMatch = card.cardDetails.name.toLowerCase().includes(modalSearchQuery.value.toLowerCase());
    
    // Filter by type
    const typeMatch = !modalSelectedType.value || card.cardDetails.type.toLowerCase().includes(modalSelectedType.value.toLowerCase());
    
    // Filter by rarity
    const rarityMatch = !modalSelectedRarity.value || card.cardDetails.rarity.toLowerCase() === modalSelectedRarity.value.toLowerCase();
    
    // Filter by color
    const colorMatch = !modalSelectedColor.value || (card.cardDetails.colors && card.cardDetails.colors.includes(modalSelectedColor.value));
    
    return nameMatch && typeMatch && rarityMatch && colorMatch;
  });
});

// Methods
const fetchData = async () => {
  if (!isAuthenticated.value || !deckId.value) return;
  
  await deckStore.fetchDeck(deckId.value);
  
  // Also fetch user's card collection for the add card functionality
  if (user.value?.id) {
    await cardStore.fetchUserCards(user.value.id);
  }
};

const addCardToDeck = async (userCardId) => {
  if (!deckId.value) return;
  
  try {
    // Add loading state if needed
    const result = await deckStore.addUserCardToDeck(deckId.value, userCardId);
    
    if (result) {
      // Only refresh the deck if the card was added successfully
      await deckStore.fetchDeck(deckId.value);
      
      // Verify the deck data is valid before continuing
      if (!deckStore.currentDeck || !deckStore.currentDeck.userCards) {
        console.error('Received invalid deck data after fetch');
        return;
      }
    } else {
      console.error('Failed to add card to deck: No deck data returned');
    }
  } catch (error) {
    console.error('Error adding card to deck:', error);
  }
};

const removeCardFromDeck = async (userCardId) => {
  if (!deckId.value) return;
  
  if (confirm('Are you sure you want to remove this card from the deck?')) {
    try {
      await deckStore.removeUserCardFromDeck(deckId.value, userCardId);
      
      // Refresh the deck data to update the UI
      await deckStore.fetchDeck(deckId.value);
    } catch (error) {
      console.error('Error removing card from deck:', error);
    }
  }
};

const resetFilters = () => {
  searchQuery.value = '';
  selectedType.value = '';
  selectedRarity.value = '';
  selectedColor.value = '';
};

const resetModalFilters = () => {
  modalSearchQuery.value = '';
  modalSelectedType.value = '';
  modalSelectedRarity.value = '';
  modalSelectedColor.value = '';
};

const getColorClass = (colorCode) => {
  const color = colorMap.find(c => c.code === colorCode);
  return color ? color.class : 'bg-gray-300';
};

const getColorName = (colorCode) => {
  const color = colorMap.find(c => c.code === colorCode);
  return color ? color.name : 'Unknown';
};

// Watch for search/filter changes for debugging
 /*
watch([searchQuery, selectedType, selectedRarity, selectedColor], () => {
 console.log({
    query: searchQuery.value,
    type: selectedType.value,
    rarity: selectedRarity.value,
    color: selectedColor.value,
    filteredCount: filteredCards.value.length
  });
});

watch([modalSearchQuery, modalSelectedType, modalSelectedRarity, modalSelectedColor], () => {
  console.log({
    modalQuery: modalSearchQuery.value,
    modalType: modalSelectedType.value,
    modalRarity: modalSelectedRarity.value,
    modalColor: modalSelectedColor.value,
    filteredModalCount: filteredAvailableCards.value.length
  });
});

watch(availableCards, () => {
  console.log({
    deck: deck.value,
    cards_in_deck: deck.value.userCards.map(card => card.id),
    all_cards: cardStore.userCards
  });
});
*/

function copyDeckList() {
  let deckList = '';
  for (const card of deck.value.userCards){
    deckList += card.card.name += '\n';
  }

  navigator.clipboard.writeText(deckList);

  document.getElementById('copyDeckListBtn').innerText = 'Copied!';

  setTimeout(() => {
    document.getElementById('copyDeckListBtn').innerText = 'Copy Decklist';
  }, 2000);
};


const onClickAction = (actionAndCardObj) => {

  if(actionAndCardObj.action === 'Add To Deck'){
    addCardToDeck(actionAndCardObj.card.id);
 
  }
}

// Fetch data on component mount
onMounted(async () => {
  await authStore.initAuth();
  await fetchData();


});
</script>
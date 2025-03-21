<!-- components/User/UserDecksList.vue -->
<template>
    <div>
      <div v-if="deckStore.loading" class="flex justify-center py-6">
        <p>Loading decks...</p>
      </div>
      
      <div v-else-if="deckStore.error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-4">
        <p>{{ deckStore.error }}</p>
      </div>
      
      <div v-else>
        <div v-if="decks.length === 0" class="text-center py-8">
          <p class="text-lg text-gray-600">You don't have any decks yet.</p>
          <button 
            @click="showCreateDeckModal = true" 
            class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Create Your First Deck
          </button>
        </div>
        
        <div v-else>
          <div class="mb-6 flex justify-between">
            <p class="text-gray-600">You have {{ decks.length }} deck(s)</p>
            <button 
              @click="showCreateDeckModal = true" 
              class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Create New Deck
            </button>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DeckItem 
              v-for="deck in decks" 
              :key="deck.id" 
              :deck="deck" 
              :userId="userId"
              @view="viewDeck"
              @edit="editDeck"
            />
          </div>
        </div>
      </div>
      
      <!-- Create Deck Modal -->
      <div v-if="showCreateDeckModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
          <h3 class="text-xl font-bold mb-4">Create New Deck</h3>
          
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="deckName">
              Deck Name
            </label>
            <input 
              v-model="newDeck.name" 
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
              id="deckName" 
              type="text" 
              placeholder="Enter deck name"
            >
          </div>
          
          <div class="mb-6">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="deckDescription">
              Description (optional)
            </label>
            <textarea 
              v-model="newDeck.description" 
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
              id="deckDescription" 
              placeholder="Enter deck description"
              rows="3"
            ></textarea>
          </div>
          
          <div class="flex justify-end">
            <button 
              @click="showCreateDeckModal = false" 
              class="mr-2 px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button 
              @click="createDeck" 
              class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300" 
              :disabled="!newDeck.name"
            >
              Create
            </button>
          </div>
        </div>
      </div>
      
      <!-- Edit Deck Modal -->
      <div v-if="showEditDeckModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
          <h3 class="text-xl font-bold mb-4">Edit Deck</h3>
          
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="editDeckName">
              Deck Name
            </label>
            <input 
              v-model="editingDeck.name" 
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
              id="editDeckName" 
              type="text" 
              placeholder="Enter deck name"
            >
          </div>
          
          <div class="mb-6">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="editDeckDescription">
              Description (optional)
            </label>
            <textarea 
              v-model="editingDeck.description" 
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
              id="editDeckDescription" 
              placeholder="Enter deck description"
              rows="3"
            ></textarea>
          </div>
          
          <div class="flex justify-end">
            <button 
              @click="showEditDeckModal = false" 
              class="mr-2 px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button 
              @click="updateDeck" 
              class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300" 
              :disabled="!editingDeck.name"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import { useDeckStore } from '~/stores/deck';
  import DeckItem from '~/components/Decks/DeckItem.vue';
  
  const props = defineProps({
    userId: {
      type: String,
      required: true
    }
  });
  
  const router = useRouter();
  const deckStore = useDeckStore();
  const decks = computed(() => deckStore.userDecks);

  // Create deck modal state
  const showCreateDeckModal = ref(false);
  const newDeck = ref({
    name: '',
    description: ''
  });
  
  // Edit deck modal state
  const showEditDeckModal = ref(false);
  const editingDeck = ref({
    id: '',
    name: '',
    description: ''
  });
  
  // Initialize - fetch decks when component mounts
  onMounted(async () => {
    if (props.userId) {
      await deckStore.fetchUserDecks(props.userId);
    }
  });
  
  // Re-fetch when userId changes
  watch(() => props.userId, async (newUserId) => {
    if (newUserId) {
      await deckStore.fetchUserDecks(newUserId);
    }
  });
  
  // Methods
  const createDeck = async () => {
    if (!newDeck.value.name) return;
    
    await deckStore.createDeck({
      name: newDeck.value.name,
      description: newDeck.value.description
    });
    
    // Reset form and close modal
    newDeck.value = { name: '', description: '' };
    showCreateDeckModal.value = false;
  };
  
  const viewDeck = (deckId) => {
    router.push(`/decks/${deckId}`);
  };
  
  const editDeck = (deckId) => {
    const deck = decks.value.find(d => d.id === deckId);
    if (deck) {
      editingDeck.value = {
        id: deck.id,
        name: deck.name,
        description: deck.description || ''
      };
      showEditDeckModal.value = true;
    }
  };
  
  const updateDeck = async () => {
    if (!editingDeck.value.name || !editingDeck.value.id) return;
    
    await deckStore.updateDeck(editingDeck.value.id, {
      name: editingDeck.value.name,
      description: editingDeck.value.description
    });
    
    // Close modal
    showEditDeckModal.value = false;
  };
  </script>
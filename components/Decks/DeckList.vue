<!-- components/Decks/DeckList.vue -->
<template>
    <div>
      <div v-if="deckStore.loading" class="text-center py-8">
        <p>Loading decks...</p>
      </div>
      
      <div v-else-if="deckStore.error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-4">
        <p>{{ deckStore.error }}</p>
      </div>
      
      <div v-else-if="decks.length === 0" class="text-center py-8">
        <p>No decks found.</p>
        <button 
          @click="$emit('create-deck')" 
          class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Create Your First Deck
        </button>
      </div>
      
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <DeckItem 
          v-for="deck in decks" 
          :key="deck.id" 
          :deck="deck" 
          :userId="userId"
          @view="$emit('view-deck', $event)"
          @edit="$emit('edit-deck', $event)"
        />
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed, onMounted, watch } from 'vue';
  import { useDeckStore } from '~/stores/deck';
  import DeckItem from './DeckItem.vue';
  
  const props = defineProps({
    userId: {
      type: String,
      required: true
    }
  });
  
  const emit = defineEmits(['view-deck', 'edit-deck', 'create-deck']);
  const deckStore = useDeckStore();
  
  // Get decks from the store
  const decks = computed(() => deckStore.userDecks);

  // Fetch decks when the component is mounted
  onMounted(async () => {
    await deckStore.fetchUserDecks(props.userId);
  });
  
  // Re-fetch decks when userId changes
  watch(() => props.userId, async (newUserId) => {  
    if (newUserId) {
      await deckStore.fetchUserDecks(newUserId);
    }
  });
  </script>
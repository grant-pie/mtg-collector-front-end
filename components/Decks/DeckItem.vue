<!-- components/Decks/DeckItem.vue -->
<template>
    <div class="bg-white shadow rounded p-4 flex justify-between">
      <div>
        <h3 class="font-bold">{{ deck.name }}</h3>
        <p class="text-gray-600 mt-1">{{ deck.description || 'No description' }}</p>
        <div class="mt-2 text-sm text-gray-500">
          <p>{{ deck.userCards?.length || 0 }} cards</p>
        </div>
      </div>
      
      <div class="flex flex-col space-y-2">
        <button
          @click="viewDeck"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          View
        </button>
        <button
          @click="editDeck"
          class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
        >
          Edit
        </button>
        <button
          @click="removeDeck"
          class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Delete
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useDeckStore } from '~/stores/deck';
  import { useRouter } from 'vue-router';
  
  const props = defineProps({
    deck: {
      type: Object,
      required: true
    },
    userId: {
      type: String,
      required: true
    }
  });
  
  const emit = defineEmits(['view', 'edit']);
  const deckStore = useDeckStore();
  const router = useRouter();
  
  const viewDeck = () => {
    emit('view', props.deck.id);
    // Alternatively, use router navigation
    // router.push(`/decks/${props.deck.id}`);
  };
  
  const editDeck = () => {
    emit('edit', props.deck.id);
    // Alternatively, use router navigation
    // router.push(`/decks/${props.deck.id}/edit`);
  };
  
  const removeDeck = async () => {
    if (confirm(`Are you sure you want to delete "${props.deck.name}"?`)) {
      await deckStore.removeDeck(props.deck.id);
    }
  };
  </script>
<!-- components/Cards/CardItem.vue -->
<template>
  <div class="bg-white shadow rounded p-4 flex justify-between">
    <div>
      <!-- Show card details if revealed OR user is admin -->
      <template v-if="card.revealed || isAdmin">
        <h3 class="font-bold">{{ card.cardDetails.name }}</h3>
        <p class="text-sm text-gray-600">{{ card.cardDetails.type }}</p>
      </template>
      <!-- Show placeholder text if not revealed and not admin -->
      <template v-else>
        <h3 class="font-bold">Mystery Card</h3>
        <p class="text-sm text-gray-600">Unknown Type</p>
      </template>
      
      <div class="mt-2">
        <!-- Show card back if not revealed AND not admin, otherwise show actual card image -->
        <img 
          v-if="!card.revealed && !isAdmin"
          src="/images/back.jpg"
          alt="Card Back" 
          class="w-40"
        />
        <img 
          v-else
          :src="card.cardDetails.imageUrl || `https://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=${card.cardDetails.multiverseId}&type=card`" 
          :alt="card.cardDetails.name"
          class="w-40"
        />
        
        <!-- Show card details if revealed OR user is admin -->
        <div v-if="card.revealed || isAdmin" class="text-sm">
          <p v-if="card.cardDetails.manaCost">Mana Cost: {{ card.cardDetails.manaCost }}</p>
          <p v-if="card.cardDetails.rarity">Rarity: {{ card.cardDetails.rarity }}</p>
          <p v-if="card.createdAt">Received: {{ formattedCreatedAt }}</p>
          <p v-if="isAdmin">Revealed: {{ card.revealed }}</p>
        </div>
        
        <!-- Always show when the card was received if not revealed/not admin -->
        <div v-if="!card.revealed && !isAdmin && card.createdAt" class="text-sm">
          <p>Received: {{ formattedCreatedAt }}</p>
        </div>
      </div>
      
      <div class="mt-2 text-sm">
        <!-- Show card text if revealed OR user is admin -->
        <p v-if="(card.revealed || isAdmin) && card.cardDetails.text">{{ card.cardDetails.text }}</p>
        <p v-else class="italic text-gray-500">This card is face down. Click "Reveal" to see its contents.</p>
        
        <!-- Admin indicator if user is admin and card is not revealed -->
        <p v-if="isAdmin && !card.revealed" class="text-xs text-purple-600 mt-1">
          Admin view: You can see this card's details before it's revealed.
        </p>
      </div>
      
      <!-- Reveal button shown only if card is not revealed -->
      <button 
        v-if="!card.revealed" 
        @click="revealCard" 
        class="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm"
      >
        Reveal
      </button>
    </div>
    <div v-if="actions">
      <button 
        v-for="action in actions"
        :key="action"
        @click="$emit('onClickAction', {action, card})" 
        class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-xs"
      >
        {{action}}
      </button>
    </div>
  </div>
</template>

<script setup>
import { useCardStore } from '~/stores/card';
import { useAuthStore } from '~/stores/auth';
import { onMounted, computed, ref } from 'vue';

const cardStore = useCardStore();
const authStore = useAuthStore();
const isLoading = ref(false);

// Check if user is admin
const isAdmin = computed(() => {
  return authStore.isAdmin;
});

const props = defineProps({
  card: {
    type: Object,
    required: true
  },
  userId: {
    type: String,
    required: false
  },
  actions: {
    type: Array,
    required: false
  }
});

const emit = defineEmits(['onClickAction', 'cardRevealed']);

const formattedCreatedAt = computed(() => {
  const date = new Date(props.card.createdAt);
  // Format as yyyy-mm-dd
  return date.toISOString().split('T')[0];
});

// Function to reveal the card
async function revealCard() {
  if (isLoading.value) return;
  
  try {
    isLoading.value = true;
    
    // Call the store method to reveal the card
    await cardStore.revealCard(props.card.id, props.userId || props.card.userId);
    
    // Emit event to notify parent that card was revealed
    emit('cardRevealed', props.card);
  } catch (error) {
    console.error('Failed to reveal card:', error);
  } finally {
    isLoading.value = false;
  }
}
</script>
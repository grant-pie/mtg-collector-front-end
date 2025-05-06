<!-- components/Cards/CardItem.vue -->
<template>
  <div class="bg-white shadow rounded p-4 flex justify-between">
    <div>
      <!-- Add null checks for card.cardDetails -->
      <template v-if="(card.revealed || isAdmin) && card.cardDetails">
        <h3 class="font-bold">{{ card.cardDetails.name }}</h3>
        <p class="text-sm text-gray-600">{{ card.cardDetails.type }}</p>
      </template>
      <!-- Show placeholder text if not revealed and not admin or if cardDetails is missing -->
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
          v-else-if="card.cardDetails && card.cardDetails.imageUrl"
          :src="card.cardDetails.imageUrl" 
          :alt="card.cardDetails && card.cardDetails.name || 'Card'"
          class="w-40"
        />
        <img 
          v-else-if="card.cardDetails && card.cardDetails.multiverseId"
          :src="`https://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=${card.cardDetails.multiverseId}&type=card`" 
          :alt="card.cardDetails && card.cardDetails.name || 'Card'"
          class="w-40"
        />
        <img 
          v-else
          src="/images/back.jpg"
          alt="Card Back" 
          class="w-40"
        />
        
        <!-- Show card details if revealed OR user is admin -->
        <div v-if="(card.revealed || isAdmin) && card.cardDetails" class="text-sm">
          <p v-if="card.cardDetails.manaCost">Mana Cost: {{ card.cardDetails.manaCost }}</p>
          <p v-if="card.cardDetails.rarity">Rarity: {{ card.cardDetails.rarity }}</p>
          <p>Willing to Trade: {{ card.willingToTrade ? 'Yes' : 'No' }}</p>
          <p v-if="card.createdAt">Received: {{ formattedCreatedAt }}</p>
          <p v-if="isAdmin">Revealed: {{ card.revealed ? 'Yes' : 'No' }}</p>
        </div>
        
        <!-- Always show when the card was received if not revealed/not admin -->
        <div v-if="!card.revealed && !isAdmin && card.createdAt" class="text-sm">
          <p>Received: {{ formattedCreatedAt }}</p>
        </div>
      </div>
      
      <div class="mt-2 text-sm">
        <!-- Show card text if revealed OR user is admin -->
        <p v-if="(card.revealed || isAdmin) && card.cardDetails && card.cardDetails.text">{{ card.cardDetails.text }}</p>
        <p v-else class="italic text-gray-500">This card is face down. Click "Reveal" to see its contents.</p>
        
        <!-- Admin indicator if user is admin and card is not revealed -->
        <p v-if="isAdmin && !card.revealed" class="text-xs text-purple-600 mt-1">
          Admin view: You can see this card's details before it's revealed.
        </p>
      </div>
      
      <!-- Action buttons -->
      <div class="mt-2 flex gap-2">
        <!-- Reveal button shown only if card is not revealed -->
        <button 
          v-if="!card.revealed && currentUser === userId" 
          @click.prevent="handleRevealClick" 
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm"
          :disabled="isLoading"
        >
          {{ isLoading ? 'Revealing...' : 'Reveal' }}
        </button>

        <!-- Trade button shown only if card is revealed -->
        <button 
          v-if="card.revealed && currentUser === userId" 
          @click.prevent="handleTradeClick" 
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm"
          :disabled="isLoading"
        >
          {{ isLoading ? 'Updating...' : (card.willingToTrade ? 'Unwilling to Trade' : 'Willing To Trade') }}
        </button>
      </div>
    </div>
    
    <!-- Action buttons in the right column -->
    <div v-if="actions">
      <button 
        v-for="action in actions"
        :key="action"
        @click.prevent="$emit('onClickAction', {action, card})" 
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

const currentUser = computed(() => {
  return authStore.userId;
});

const emit = defineEmits(['onClickAction', 'cardRevealed', 'cardUpdateWillingToTrade']);

const formattedCreatedAt = computed(() => {
  const date = new Date(props.card.createdAt);
  // Format as yyyy-mm-dd
  return date.toISOString().split('T')[0];
});

// Function to handle the reveal button click
async function handleRevealClick() {
  if (isLoading.value) return;
  
  try {
    isLoading.value = true;
    
    // Use direct action name instead of emitting button action
    emit('onClickAction', { action: 'Reveal', card: props.card });
    
    // Original reveal code is kept for the direct event
    const updatedCard = await cardStore.revealCard(props.card.id, props.userId || props.card.userId);
    
    if (updatedCard) {
      emit('cardRevealed', updatedCard);
    }
  } catch (error) {
    console.error('Failed to reveal card:', error);
  } finally {
    isLoading.value = false;
  }
}

// Function to handle the trade button click
async function handleTradeClick() {
  if (isLoading.value) return;
  
  try {
    isLoading.value = true;
    
    // Use direct action name for consistency
    const actionName = props.card.willingToTrade ? 'Unwilling to Trade' : 'Willing To Trade';
    emit('onClickAction', { action: actionName, card: props.card });
    
    // Original trade code is kept for the direct event
    const updatedCard = await cardStore.setWillingToTrade(
      props.card.id, 
      props.userId || props.card.userId, 
      props.card.willingToTrade
    );
    
    if (updatedCard) {
      emit('cardUpdateWillingToTrade', updatedCard);
    }
  } catch (error) {
    console.error('Failed to set willing to trade:', error);
  } finally {
    isLoading.value = false;
  }
}

// Original functions kept for direct event handlers
async function revealCard() {
  if (isLoading.value) return;
  
  try {
    isLoading.value = true;
    
    const updatedCard = await cardStore.revealCard(props.card.id, props.userId || props.card.userId);
    
    if (updatedCard) {
      emit('cardRevealed', updatedCard);
    }
  } catch (error) {
    console.error('Failed to reveal card:', error);
  } finally {
    isLoading.value = false;
  }
}

async function setWillingToTrade() {
  if (isLoading.value) return;
  
  try {
    isLoading.value = true;
    
    const updatedCard = await cardStore.setWillingToTrade(
      props.card.id, 
      props.userId || props.card.userId, 
      props.card.willingToTrade
    );
    
    if (updatedCard) {
      emit('cardUpdateWillingToTrade', updatedCard);
    }
  } catch (error) {
    console.error('Failed to set willing to trade:', error);
  } finally {
    isLoading.value = false;
  }
}
</script>
<!-- components/Cards/CardList.vue -->
<template>
  <div>
    <div v-if="loading" class="text-center py-10">
      <p>Loading cards...</p>
    </div>
    
    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      {{ error }}
    </div>
    
    <div v-else-if="cards.length === 0" class="text-center py-10">
      <p>No cards found.</p>
    </div>
    
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <CardItem 
        v-for="card in cards" 
        :key="card.id" 
        :card="card" 
        :userId="userId"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useCardStore } from '~/stores/card';
import { storeToRefs } from 'pinia';
import CardItem from '~/components/Cards/CardItem.vue';

const props = defineProps({
  userId: {
    type: String,
    required: true
  },
  userIsAdmin: {
    type: Boolean,
    require: false
  }
});

const cardStore = useCardStore();
const { userCards, loading, error } = storeToRefs(cardStore);
const cards = userCards;

onMounted(async () => {
  await cardStore.fetchUserCards(props.userId);
});

// Refetch cards when userId changes
watch(() => props.userId, async (newUserId) => {
  await cardStore.fetchUserCards(newUserId);
});
</script>
// stores/deck.ts
import { defineStore } from 'pinia';
import { useAuthStore } from './auth';

// Define interfaces for API responses
interface Deck {
  id: string;
  name: string;
  description: string;
  userId: string;
  userCards: any[];
  createdAt: string;
  updatedAt: string;
}

interface DecksResponse {
  decks: Deck[];
  error?: string;
}

interface DeckResponse {
  deck: Deck;
  error?: string;
}

interface SuccessResponse {
  success: boolean;
}

export const useDeckStore = defineStore('deck', {
  state: () => ({
    userDecks: [] as Deck[],
    currentDeck: null as Deck | null,
    loading: false,
    error: null as string | null,
  }),
  
  actions: {
    async fetchUserDecks(userId: string) {
      const authStore = useAuthStore();
      const config = useRuntimeConfig();
      if (!authStore.token) return;
      
      try {
        this.loading = true;
        this.error = null;
        
        const response = await $fetch<DecksResponse>(`${config.public.apiBaseUrl}/decks/user/${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authStore.token}`
          }
        });
        
        this.userDecks = response.decks || [];
      } catch (err: any) {
        console.error('Error fetching user decks:', err);
        this.error = err.message || 'Failed to fetch decks';
      } finally {
        this.loading = false;
      }
    },
    
    async fetchDeck(deckId: string) {
      const authStore = useAuthStore();
      const config = useRuntimeConfig();
      if (!authStore.token) return null;
      
      try {
        this.loading = true;
        this.error = null;
        
        const response = await $fetch<DeckResponse>(`${config.public.apiBaseUrl}/decks/${deckId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authStore.token}`
          }
        });
        
        if (response.error) {
          this.error = response.error;
          return null;
        }
        
        this.currentDeck = response.deck;
        return response.deck;
      } catch (err: any) {
        console.error('Error fetching deck:', err);
        this.error = err.message || 'Failed to fetch deck';
        return null;
      } finally {
        this.loading = false;
      }
    },
    
    async createDeck(deckData: { name: string; description?: string }) {
      const authStore = useAuthStore();
      const config = useRuntimeConfig();
      if (!authStore.token) return null;
      
      try {
        this.loading = true;
        this.error = null;
        
        const response = await $fetch<DeckResponse>(`${config.public.apiBaseUrl}/decks`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authStore.token}`,
            'Content-Type': 'application/json'
          },
          body: deckData
        });
        
        // Update decks list
        if (authStore.user?.id) {
          await this.fetchUserDecks(authStore.user.id);
        }
        
        return response.deck;
      } catch (err: any) {
        console.error('Error creating deck:', err);
        this.error = err.message || 'Failed to create deck';
        return null;
      } finally {
        this.loading = false;
      }
    },

    async createDeckForUser(deckData: { name: string; description?: string }, userId: string) {
      const authStore = useAuthStore();
      const config = useRuntimeConfig();
      if (!authStore.token) return null;
      
      try {
        this.loading = true;
        this.error = null;
        
        const response = await $fetch<DeckResponse>(`${config.public.apiBaseUrl}/decks/user/${userId}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authStore.token}`,
            'Content-Type': 'application/json'
          },
          body: deckData
        });
        
        // Update decks list
        if (authStore.user?.id) {
          await this.fetchUserDecks(authStore.user.id);
        }
        
        return response.deck;
      } catch (err: any) {
        console.error('Error creating deck:', err);
        this.error = err.message || 'Failed to create deck';
        return null;
      } finally {
        this.loading = false;
      }
    },
    
    async updateDeck(deckId: string, deckData: { name?: string; description?: string }) {
      const authStore = useAuthStore();
      const config = useRuntimeConfig();
      if (!authStore.token) return null;
      
      try {
        this.loading = true;
        this.error = null;
        
        const response = await $fetch<DeckResponse>(`${config.public.apiBaseUrl}/decks/${deckId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${authStore.token}`,
            'Content-Type': 'application/json'
          },
          body: deckData
        });
        
        // Update the current deck if it's the one we just updated
        if (this.currentDeck && this.currentDeck.id === deckId) {
          this.currentDeck = response.deck;
        }
        
        // Refresh the decks list
        if (authStore.user?.id) {
          await this.fetchUserDecks(authStore.user.id);
        }
        
        return response.deck;
      } catch (err: any) {
        console.error('Error updating deck:', err);
        this.error = err.message || 'Failed to update deck';
        return null;
      } finally {
        this.loading = false;
      }
    },
    
    async removeDeck(deckId: string) {
      const authStore = useAuthStore();
      const config = useRuntimeConfig();
      if (!authStore.token) return false;
      
      try {
        this.loading = true;
        this.error = null;
        
        await $fetch<SuccessResponse>(`${config.public.apiBaseUrl}/decks/${deckId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${authStore.token}`
          }
        });
        
        // Clear current deck if it's the one we just deleted
        if (this.currentDeck && this.currentDeck.id === deckId) {
          this.currentDeck = null;
        }
        
        // Refresh the decks list
        if (authStore.user?.id) {
          await this.fetchUserDecks(authStore.user.id);
        }
        
        return true;
      } catch (err: any) {
        console.error('Error removing deck:', err);
        this.error = err.message || 'Failed to remove deck';
        return false;
      } finally {
        this.loading = false;
      }
    },
    
    // Updated to match backend route: POST /decks/:deckId/user-cards/:userCardId
    async addUserCardToDeck(deckId: string, userCardId: string) {
      const authStore = useAuthStore();
      const config = useRuntimeConfig();
      if (!authStore.token) return null;
      
      try {
        this.loading = true;
        this.error = null;
        
        // Check if both IDs are valid before making the API call
        if (!deckId || !userCardId) {
          this.error = 'Invalid deck or card ID';
          return null;
        }
        
        const response = await $fetch<DeckResponse>(`${config.public.apiBaseUrl}/decks/${deckId}/user-cards/${userCardId}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authStore.token}`
          }
        });
        
        // Check if the response has the expected structure
        if (!response || !response.deck) {
          this.error = 'Invalid response received';
          return null;
        }
        
        // Update the current deck if it's the one we just modified
        if (this.currentDeck && this.currentDeck.id === deckId) {
          this.currentDeck = response.deck;
        }
        
        return response.deck;
      } catch (err: any) {
        console.error('Error adding card to deck:', err);
        this.error = err.message || 'Failed to add card to deck';
        return null;
      } finally {
        this.loading = false;
      }
    },
    // '/user/:userId/:deckId/user-cards'
    async addUserCardToDeckForUser(userId: string, deckId: string, userCardId: string) {
      console.log('addUserCardToDeckForUser');
      const authStore = useAuthStore();
      const config = useRuntimeConfig();
      if (!authStore.token) return null;
      
      try {
        this.loading = true;
        this.error = null;
        
        const response = await $fetch<DeckResponse>(`${config.public.apiBaseUrl}/decks/user/${userId}/${deckId}/user-cards`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authStore.token}`,
            'Content-Type': 'application/json'
          },
          body: { userCardId }
        });
        
        // Update the current deck if it's the one we just modified
        if (this.currentDeck && this.currentDeck.id === deckId) {
          this.currentDeck = response.deck;
        }
        
        return response.deck;
      } catch (err: any) {
        console.error('Error adding card to deck for user:', err);
        this.error = err.message || 'Failed to add card to deck';
        return null;
      } finally {
        this.loading = false;
      }
    },
  
    // Updated to match backend route: DELETE /decks/:deckId/user-cards/:userCardId
    async removeUserCardFromDeck(deckId: string, userCardId: string) {
      const authStore = useAuthStore();
      const config = useRuntimeConfig();
      if (!authStore.token) return null;
      
      try {
        this.loading = true;
        this.error = null;
        
        const response = await $fetch<DeckResponse>(`${config.public.apiBaseUrl}/decks/${deckId}/user-cards/${userCardId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${authStore.token}`
          }
        });
        
        // Update the current deck if it's the one we just modified
        if (this.currentDeck && this.currentDeck.id === deckId) {
          this.currentDeck = response.deck;
        }
        
        return response.deck;
      } catch (err: any) {
        console.error('Error removing card from deck:', err);
        this.error = err.message || 'Failed to remove card from deck';
        return null;
      } finally {
        this.loading = false;
      }
    },
    
  
  }
});
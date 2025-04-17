// stores/trade.ts
import { defineStore } from 'pinia';
import { useAuthStore } from './auth';
import { useRuntimeConfig } from '#app';

// Type definitions based on your backend entity
export enum TradeStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  CANCELED = 'canceled'
}

interface Trade {
  id: string;
  initiatorId: string;
  receiverId: string;
  initiatorCards: string[];
  receiverCards: string[];
  status: TradeStatus;
  respondedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

interface CreateTradePayload {
  receiverId: string;
  initiatorCardIds: string[];
  receiverCardIds: string[];
}

interface RespondTradePayload {
  accept: boolean;
}

interface TradeState {
  trades: Trade[];
  pendingTrades: Trade[];
  currentTrade: Trade | null;
  loading: boolean;
  error: string | null;
  createTradeLoading: boolean;
  createTradeError: string | null;
  respondTradeLoading: boolean;
  respondTradeError: string | null;
}

export const useTradeStore = defineStore('trade', {
  state: (): TradeState => ({
    trades: [],
    pendingTrades: [],
    currentTrade: null,
    loading: false,
    error: null,
    createTradeLoading: false,
    createTradeError: null,
    respondTradeLoading: false,
    respondTradeError: null
  }),
  
  getters: {
    // Get trades where the user is the initiator
    initiatedTrades: (state) => {
      const authStore = useAuthStore();
      return state.trades.filter(trade => trade.initiatorId === authStore.user?.id);
    },
    
    // Get trades where the user is the receiver
    receivedTrades: (state) => {
      const authStore = useAuthStore();
      return state.trades.filter(trade => trade.receiverId === authStore.user?.id);
    }
  },
  
  actions: {
    // Fetch all trades for the current user
    async fetchAllTrades() {
      const authStore = useAuthStore();
      
      if (!authStore.token) {
        this.error = 'Authentication required';
        return;
      }
      
      this.loading = true;
      this.error = null;
      
      try {
        const config = useRuntimeConfig();
        const response = await $fetch<{ trades: Trade[] }>(`${config.public.apiBaseUrl}/trades`, {
          headers: {
            Authorization: `Bearer ${authStore.token}`
          }
        });
        
      
        this.trades = response.trades;
  
      } catch (err) {
        console.error('Error fetching trades:', err);
        this.error = 'Failed to load trades';
      } finally {
        this.loading = false;
      }
    },
    
    // Fetch pending trades for the current user
    async fetchPendingTrades() {
      const authStore = useAuthStore();
      
      if (!authStore.token) {
        this.error = 'Authentication required';
        return;
      }
      
      this.loading = true;
      this.error = null;
      
      try {
        const config = useRuntimeConfig();
        const response = await $fetch<{ trades: Trade[] }>(`${config.public.apiBaseUrl}/trades/pending`, {
          headers: {
            Authorization: `Bearer ${authStore.token}`
          }
        });
        
        this.pendingTrades = response.trades;
      } catch (err) {
        console.error('Error fetching pending trades:', err);
        this.error = 'Failed to load pending trades';
      } finally {
        this.loading = false;
      }
    },
    
    // Fetch a specific trade by ID
    async fetchTradeById(id: string) {
      const authStore = useAuthStore();
      
      if (!authStore.token) {
        this.error = 'Authentication required';
        return;
      }
      
      this.loading = true;
      this.error = null;
      
      try {
        const config = useRuntimeConfig();
        const response = await $fetch<{ trade: Trade }>(`${config.public.apiBaseUrl}/trades/${id}`, {
          headers: {
            Authorization: `Bearer ${authStore.token}`
          }
        });
        
        this.currentTrade = response.trade;
      } catch (err) {
        console.error(`Error fetching trade ${id}:`, err);
        this.error = 'Failed to load trade';
      } finally {
        this.loading = false;
      }
    },
    
    // Create a new trade
    async createTrade(payload: CreateTradePayload) {
      const authStore = useAuthStore();
      
      if (!authStore.token) {
        this.createTradeError = 'Authentication required';
        return null;
      }
      
      this.createTradeLoading = true;
      this.createTradeError = null;
      
      try {
        const config = useRuntimeConfig();
        const response = await $fetch<{ trade: Trade }>(`${config.public.apiBaseUrl}/trades`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${authStore.token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        
        // Add the new trade to the trades array
        this.trades.push(response.trade);
        if (response.trade.status === TradeStatus.PENDING) {
          this.pendingTrades.push(response.trade);
        }
        
        return response.trade;
      } catch (err: any) {
        console.error('Error creating trade:', err);
        this.createTradeError = err.data?.message || 'Failed to create trade';
        return null;
      } finally {
        this.createTradeLoading = false;
      }
    },
    
    // Respond to a trade (accept or reject)
    async respondToTrade(id: string, payload: RespondTradePayload) {
      const authStore = useAuthStore();
      
      if (!authStore.token) {
        this.respondTradeError = 'Authentication required';
        return null;
      }
      
      this.respondTradeLoading = true;
      this.respondTradeError = null;
      
      try {
        const config = useRuntimeConfig();
        const response = await $fetch<{ trade: Trade }>(`${config.public.apiBaseUrl}/trades/${id}/respond`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${authStore.token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        
        // Update the trade in the trades array
        const index = this.trades.findIndex(t => t.id === id);
        if (index !== -1) {
          this.trades[index] = response.trade;
        }
        
        // Remove from pending trades
        const pendingIndex = this.pendingTrades.findIndex(t => t.id === id);
        if (pendingIndex !== -1) {
          this.pendingTrades.splice(pendingIndex, 1);
        }
        
        // Update current trade if it's the one being viewed
        if (this.currentTrade?.id === id) {
          this.currentTrade = response.trade;
        }
        
        return response.trade;
      } catch (err: any) {
        console.error(`Error responding to trade ${id}:`, err);
        this.respondTradeError = err.data?.message || 'Failed to respond to trade';
        return null;
      } finally {
        this.respondTradeLoading = false;
      }
    },
    
    // Cancel a trade
    async cancelTrade(id: string) {
      const authStore = useAuthStore();
      
      if (!authStore.token) {
        this.error = 'Authentication required';
        return null;
      }
      
      this.loading = true;
      this.error = null;
      
      try {
        const config = useRuntimeConfig();
        const response = await $fetch<{ trade: Trade }>(`${config.public.apiBaseUrl}/trades/${id}/cancel`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${authStore.token}`
          }
        });
        
        // Update the trade in the trades array
        const index = this.trades.findIndex(t => t.id === id);
        if (index !== -1) {
          this.trades[index] = response.trade;
        }
        
        // Remove from pending trades
        const pendingIndex = this.pendingTrades.findIndex(t => t.id === id);
        if (pendingIndex !== -1) {
          this.pendingTrades.splice(pendingIndex, 1);
        }
        
        // Update current trade if it's the one being viewed
        if (this.currentTrade?.id === id) {
          this.currentTrade = response.trade;
        }
        
        return response.trade;
      } catch (err: any) {
        console.error(`Error canceling trade ${id}:`, err);
        this.error = err.data?.message || 'Failed to cancel trade';
        return null;
      } finally {
        this.loading = false;
      }
    },
    
    // Reset the create trade state
    resetCreateTradeState() {
      this.createTradeLoading = false;
      this.createTradeError = null;
    },
    
    // Reset the respond trade state
    resetRespondTradeState() {
      this.respondTradeLoading = false;
      this.respondTradeError = null;
    },
    
    // Reset error state
    resetErrorState() {
      this.error = null;
    }
  }
});
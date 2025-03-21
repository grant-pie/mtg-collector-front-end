// stores/card.ts
import { defineStore } from 'pinia';
import { useAuthStore } from './auth';

interface Card {
  id: string;
  scryfallId: string;
  name: string;
  manaCost?: string;
  convertedManaCost?: number;
  type?: string;
  colors?: string[];
  rarity?: string;
  set?: string;
  setName?: string;
  text?: string;
  artist?: string;
  power?: string;
  toughness?: string;
  imageUrl?: string;
}

interface UserCard {
  id: string;
  userId: string;
  cardId: string;
  cardDetails: Card;
  createdAt: string;
}

interface PaginationMeta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export const useCardStore = defineStore('card', {
  state: () => ({
    userCards: [] as UserCard[],
    allCards: [] as Card[],
    loading: false,
    error: null as string | null,
    pagination: {
      totalItems: 0,
      itemCount: 0,
      itemsPerPage: 10,
      totalPages: 0,
      currentPage: 1
    } as PaginationMeta
  }),
  
  actions: {
    async fetchUserCards(userId: string, page = 1, limit = 10) {
      const authStore = useAuthStore();
      const config = useRuntimeConfig();
      if (!authStore.token) return;
      
      try {
        this.loading = true;
        this.error = null;
        
        const response = await $fetch(`${config.public.apiBaseUrl}/user-cards/${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authStore.token}`
          },
          params: {
            page,
            limit
          }
        });
        
        this.userCards = response.cards || [];
        this.pagination = response.pagination || this.pagination;
      } catch (err: any) {
        console.error('Error fetching user cards:', err);
        this.error = err.message || 'Failed to fetch cards';
      } finally {
        this.loading = false;
      }
    },
    
    async fetchCardsByUsername(username: string, searchParams?: Record<string, any>) {
      const config = useRuntimeConfig();
      
      try {
        this.loading = true;
        this.error = null;
        
        // Set default pagination values if not provided
        if (!searchParams) {
          searchParams = {};
        }
        if (searchParams.page === undefined) {
          searchParams.page = 1;
        }
        if (searchParams.limit === undefined) {
          searchParams.limit = 10;
        }
        
        // Build query string
        const queryParams = new URLSearchParams();
        for (const [key, value] of Object.entries(searchParams)) {
          if (value !== undefined && value !== null && value !== '') {
            // Handle array values (like colors)
            if (Array.isArray(value)) {
              value.forEach((item: string) => {
                queryParams.append(key, item);
              });
            } else {
              queryParams.append(key, value.toString());
            }
          }
        }
        
        const queryString = queryParams.toString();
        let url = `${config.public.apiBaseUrl}/user-cards/username/${username}`;
        if (queryString) {
          url += `?${queryString}`;
        }
        
        const response = await $fetch(url, {
          method: 'GET'
        });
        
        this.userCards = response.cards || [];
        this.pagination = response.pagination || this.pagination;
        return this.userCards;
      } catch (err: any) {
        console.error('Error fetching cards by username:', err);
        this.error = err.message || 'Failed to fetch cards';
        return [];
      } finally {
        this.loading = false;
      }
    },
    
    async searchUserCards(userId: string, searchParams: Record<string, any> = {}) {
      const authStore = useAuthStore();
      const config = useRuntimeConfig();
      if (!authStore.token) return;
      
      try {
        this.loading = true;
        this.error = null;
        
        // Set default pagination values if not provided
        if (searchParams.page === undefined) {
          searchParams.page = 1;
        }
        if (searchParams.limit === undefined) {
          searchParams.limit = 10;
        }
        
        // Build query string
        const queryParams = new URLSearchParams();
        for (const [key, value] of Object.entries(searchParams)) {
          if (value !== undefined && value !== null && value !== '') {
            // Handle array values (like colors)
            if (Array.isArray(value)) {
              value.forEach((item: string) => {
                queryParams.append(key, item);
              });
            } else {
              queryParams.append(key, value.toString());
            }
          }
        }
        
        const queryString = queryParams.toString();
        const url = `${config.public.apiBaseUrl}/user-cards/${userId}${queryString ? `?${queryString}` : ''}`;
        
        const response = await $fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authStore.token}`
          }
        });
        
        this.userCards = response.cards || [];
        this.pagination = response.pagination || this.pagination;
      } catch (err: any) {
        console.error('Error searching user cards:', err);
        this.error = err.message || 'Failed to search cards';
      } finally {
        this.loading = false;
      }
    },
    
    // Pagination navigation methods
    async goToPage(userId: string, page: number, searchParams: Record<string, any> = {}) {
      if (page < 1 || page > this.pagination.totalPages) return;
      
      const params = { ...searchParams, page };
      
      if (searchParams.username) {
        // Use fetchCardsByUsername if we're viewing someone else's collection
        const username = searchParams.username;
        delete params.username;
        await this.fetchCardsByUsername(username, params);
      } else {
        // Otherwise use the user ID version
        await this.searchUserCards(userId, params);
      }
    },
    
    async nextPage(userId: string, searchParams: Record<string, any> = {}) {
      if (this.pagination.currentPage < this.pagination.totalPages) {
        await this.goToPage(userId, this.pagination.currentPage + 1, searchParams);
      }
    },
    
    async prevPage(userId: string, searchParams: Record<string, any> = {}) {
      if (this.pagination.currentPage > 1) {
        await this.goToPage(userId, this.pagination.currentPage - 1, searchParams);
      }
    },
    
    async addCardToUser(userId: string, scryfallId: string) {
      const authStore = useAuthStore();
      const config = useRuntimeConfig();
      if (!authStore.isAdmin) return;
      
      try {
        this.loading = true;
        this.error = null;
        
        const userCard = await $fetch(`${config.public.apiBaseUrl}/user-cards/${userId}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authStore.token}`,
            'Content-Type': 'application/json'
          },
          body: { scryfallId }
        });
        
        // Refresh the cards list - maintain current page
        await this.fetchUserCards(userId, this.pagination.currentPage);
        return userCard;
      } catch (err: any) {
        console.error('Error adding card:', err);
        this.error = err.message || 'Failed to add card';
      } finally {
        this.loading = false;
      }
    },
    
    async removeCard(cardId: string, userId: string) {
      const authStore = useAuthStore();
      const config = useRuntimeConfig();
      if (!authStore.token) return;
      
      try {
        this.loading = true;
        this.error = null;
        
        await $fetch(`${config.public.apiBaseUrl}/user-cards/${cardId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${authStore.token}`
          }
        });
        
        // Refresh the cards list - maintain current page
        await this.fetchUserCards(userId, this.pagination.currentPage);
      } catch (err: any) {
        this.error = err.message || 'Failed to remove card';
      } finally {
        this.loading = false;
      }
    },
    
    async searchCards(query: Record<string, any>) {
      const authStore = useAuthStore();
      const config = useRuntimeConfig();
      if (!authStore.token) return;
      
      try {
        this.loading = true;
        this.error = null;
        
        // Build query string
        const queryParams = new URLSearchParams();
        for (const [key, value] of Object.entries(query)) {
          if (value) {
            queryParams.append(key, value.toString());
          }
        }
        
        const response = await $fetch(`${config.public.apiBaseUrl}/cards?${queryParams.toString()}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authStore.token}`
          }
        });
        
        this.allCards = response || [];
        return this.allCards;
      } catch (err: any) {
        console.error('Error searching cards:', err);
        this.error = err.message || 'Failed to search cards';
        return [];
      } finally {
        this.loading = false;
      }
    },
    
    async fetchCardDetails(scryfallId: string) {
      const authStore = useAuthStore();
      const config = useRuntimeConfig();
      if (!authStore.token) return null;
      
      try {
        const response = await $fetch(`${config.public.apiBaseUrl}/cards/multiverse/${scryfallId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authStore.token}`
          }
        });
        
        return response;
      } catch (err: any) {
        console.error('Error fetching card details:', err);
        return null;
      }
    }
  }
});
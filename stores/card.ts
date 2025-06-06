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
  revealed: boolean; // Added the revealed property
  createdAt: string;
}

interface PaginationMeta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

interface TradingCard extends UserCard {
  username?: string;
}
// Valid page size options as defined in user-card.controller.ts
const VALID_PAGE_SIZES = [10, 20, 50];
const DEFAULT_PAGE_SIZE = 10;

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
    } as PaginationMeta,
    validPageSizes: VALID_PAGE_SIZES,
    tradingMarketplace: [] as TradingCard[],
    tradingPagination: {
      totalItems: 0,
      itemCount: 0,
      itemsPerPage: 10,
      totalPages: 0,
      currentPage: 1
    } as PaginationMeta,

  }),
  
  actions: {
    // Helper method to set loading state
    setLoading(status: boolean) {
      this.loading = status;
    },

    
    async fetchCardById(cardId: string) {
      const authStore = useAuthStore();
      const config = useRuntimeConfig();
      if (!authStore.token) return null;
      
      try {
        this.loading = true;
        this.error = null;
        
        const response = await $fetch(`${config.public.apiBaseUrl}/user-cards/${cardId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authStore.token}`
          }
        });
        
        return response.userCard;
      } catch (err: any) {
        console.error('Error fetching card by ID:', err);
        this.error = err.message || 'Failed to fetch card';
        return null;
      } finally {
        this.loading = false;
      }
    },

    async fetchUserCards(userId: string, page = 1, limit = 10, params = {}) {
      const authStore = useAuthStore();
      const config = useRuntimeConfig();
      if (!authStore.token) return;
      
      try {
        this.loading = true;
        this.error = null;
        
        // Validate the limit value against allowed page sizes
        const validatedLimit = this.validatePageSize(limit);
        
        // Merge pagination with additional params (for hideBasicLands)
        const queryParams = {
          page,
          limit: validatedLimit,
          ...params
        };
        
        // Build query string
        const queryString = new URLSearchParams();
        for (const [key, value] of Object.entries(queryParams)) {
          if (value !== undefined && value !== null && value !== '') {
            // Handle array values
            if (Array.isArray(value)) {
              value.forEach((item: string) => {
                queryString.append(key, item);
              });
            } else {
              queryString.append(key, value.toString());
            }
          }
        }
        
        const url = `${config.public.apiBaseUrl}/user-cards/user/${userId}${queryString.toString() ? `?${queryString.toString()}` : ''}`;
        
        // UPDATED: Use useFetch with SPA-friendly options - removed invalid 'redirect: false'
        const { data, error } = await useFetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authStore.token}`
          },
          // Key parameters to prevent page refresh
          watch: false,
          key: `user-cards-${userId}-${JSON.stringify(queryParams)}`
        });
        
        if (error.value) {
          throw new Error(error.value.message || 'Failed to fetch cards');
        }
        
        const response = data.value as any;
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
        
        // Validate the limit value
        searchParams.limit = this.validatePageSize(searchParams.limit);
        
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
        
        // UPDATED: Use useFetch with SPA-friendly options - removed invalid 'redirect: false'
        const { data, error } = await useFetch(url, {
          method: 'GET',
          // Key parameters to prevent page refresh
          watch: false,
          key: `username-cards-${username}-${JSON.stringify(searchParams)}`
        });
        
        if (error.value) {
          throw new Error(error.value.message || 'Failed to fetch cards');
        }
        
        const response = data.value as any;
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
        
        // Validate the limit value
        searchParams.limit = this.validatePageSize(searchParams.limit);
        
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
        const url = `${config.public.apiBaseUrl}/user-cards/user/${userId}${queryString ? `?${queryString}` : ''}`;
        
        // UPDATED: Use useFetch with SPA-friendly options - removed invalid 'redirect: false'
        const { data, error } = await useFetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authStore.token}`
          },
          // Key parameters to prevent page refresh
          watch: false, 
          key: `search-user-cards-${userId}-${JSON.stringify(searchParams)}`
        });
        
        if (error.value) {
          throw new Error(error.value.message || 'Failed to search cards');
        }
        
        const response = data.value as any;
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
    
    // Fix for nextPage method in card.ts
    async nextPage(userId: string, searchParams: Record<string, any> = {}) {
      if (this.pagination.currentPage < this.pagination.totalPages) {
        // Make sure we preserve the limit parameter
        const nextPageParams = { 
          ...searchParams, 
          page: this.pagination.currentPage + 1
        };
        
        // Ensure limit is set and validated
        if (!nextPageParams.limit) {
          nextPageParams.limit = this.pagination.itemsPerPage;
        }
        
        await this.goToPage(userId, this.pagination.currentPage + 1, nextPageParams);
      }
    },

    // Fix for prevPage method in card.ts
    async prevPage(userId: string, searchParams: Record<string, any> = {}) {
      if (this.pagination.currentPage > 1) {
        // Make sure we preserve the limit parameter
        const prevPageParams = { 
          ...searchParams, 
          page: this.pagination.currentPage - 1
        };
        
        // Ensure limit is set and validated
        if (!prevPageParams.limit) {
          prevPageParams.limit = this.pagination.itemsPerPage;
        }
        
        await this.goToPage(userId, this.pagination.currentPage - 1, prevPageParams);
      }
    },
    
    // UPDATED: Modified to prevent page refresh
    async changeItemsPerPage(userId: string, limit: number, searchParams: Record<string, any> = {}) {
      // Validate the limit value
      const validatedLimit = this.validatePageSize(limit);
      
      // Reset to page 1 when changing items per page
      const params = { ...searchParams, limit: validatedLimit, page: 1 };
      
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
    
    // Validate page size to ensure it's one of the allowed values
    validatePageSize(limit: number): number {
      // Convert string to number if needed
      const parsedLimit = typeof limit === 'string' ? parseInt(limit, 10) : limit;
      
      // If we have a valid number that matches our options, use it
      if (!isNaN(parsedLimit) && VALID_PAGE_SIZES.includes(parsedLimit)) {
        return parsedLimit;
      }
      
      // For invalid values, check if we have a current itemsPerPage in pagination
      if (this.pagination && this.pagination.itemsPerPage) {
        // Maintain the current pagination setting if possible
        if (VALID_PAGE_SIZES.includes(this.pagination.itemsPerPage)) {
          return this.pagination.itemsPerPage;
        }
      }
      
      // Fallback to default
      return DEFAULT_PAGE_SIZE;
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
        
        // Refresh the cards list - maintain current page and limit
        await this.fetchUserCards(userId, this.pagination.currentPage, this.pagination.itemsPerPage);
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
        
        // Refresh the cards list - maintain current page and limit
        await this.fetchUserCards(userId, this.pagination.currentPage, this.pagination.itemsPerPage);
      } catch (err: any) {
        this.error = err.message || 'Failed to remove card';
      } finally {
        this.loading = false;
      }
    },
    
    // New method to reveal a card
    async revealCard(cardId: string, userId: string) {
      const authStore = useAuthStore();
      const config = useRuntimeConfig();
      if (!authStore.token) return;
      
      try {
        this.loading = true;
        this.error = null;
        
        // Use useFetch with SPA-friendly options
        const { data, error } = await useFetch(`${config.public.apiBaseUrl}/user-cards/${cardId}/reveal`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${authStore.token}`
          },
          watch: false,
          key: `reveal-card-${cardId}`
        });
        
        if (error.value) {
          throw new Error(error.value.message || 'Failed to reveal card');
        }
        
        const response = data.value as any;
        
        // Find the card index in the userCards array
        const cardIndex = this.userCards.findIndex(card => card.id === cardId);
        
        if (cardIndex !== -1) {
          // Get the current card to preserve any data that might not be in the response
          const currentCard = this.userCards[cardIndex];
          const updatedCard = response.userCard;
          
          // Create merged card preserving cardDetails if missing in response
          const mergedCard = {
            ...currentCard,
            ...updatedCard,
            // Preserve cardDetails if they exist in current card but not in response
            cardDetails: updatedCard.cardDetails || currentCard.cardDetails
          };
          
          // Create a new array with the updated card to maintain reactivity
          const updatedCards = [...this.userCards];
          updatedCards[cardIndex] = mergedCard;
          
          // Update the state
          this.userCards = updatedCards;
          
          return mergedCard;
        }
        
        return response.userCard;
      } catch (err: any) {
        console.error('Error revealing card:', err);
        this.error = err.message || 'Failed to reveal card';
      } finally {
        this.loading = false;
      }
    },

    // Update the setWillingToTrade method in your card.ts store file
    async setWillingToTrade(cardId: string, userId: string, willingToTrade: boolean) {
      const authStore = useAuthStore();
      const config = useRuntimeConfig();
      if (!authStore.token) return;
    
      try {
        this.loading = true;
        this.error = null;
        
        const { data, error } = await useFetch(`${config.public.apiBaseUrl}/user-cards/${cardId}/trade-willing`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${authStore.token}`
          },
          body: {
            'willingToTrade': !willingToTrade
          },
          watch: false,
          key: `trade-willing-${cardId}-${!willingToTrade}`
        });
        
        if (error.value) {
          throw new Error(error.value.message || 'Failed to update trading status');
        }
        
        const response = data.value as any;
        
        // Find the card index in the userCards array
        const cardIndex = this.userCards.findIndex(card => card.id === cardId);
        
        if (cardIndex !== -1) {
          // Get the current card to preserve any data that might not be in the response
          const currentCard = this.userCards[cardIndex];
          const updatedCard = response.userCard;
          
          // Create merged card preserving cardDetails if missing in response
          const mergedCard = {
            ...currentCard,
            ...updatedCard,
            // Preserve cardDetails if they exist in current card but not in response
            cardDetails: updatedCard.cardDetails || currentCard.cardDetails
          };
          
          // Create a new array with the updated card to maintain reactivity
          const updatedCards = [...this.userCards];
          updatedCards[cardIndex] = mergedCard;
          
          // Update the state
          this.userCards = updatedCards;
          
          return mergedCard;
        }
        
        return response.userCard;
      } catch (err: any) {
        console.error('Error updating trading status:', err);
        this.error = err.message || 'Failed to update trading status';
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
        
        // UPDATED: Use useFetch with SPA-friendly options - removed invalid 'redirect: false'
        const { data, error } = await useFetch(`${config.public.apiBaseUrl}/cards?${queryParams.toString()}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authStore.token}`
          },
          // Key parameters to prevent page refresh
          watch: false,
          key: `search-cards-${JSON.stringify(query)}`
        });
        
        if (error.value) {
          throw new Error(error.value.message || 'Failed to search cards');
        }
        
        const response = data.value as any;
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
    },

    async fetchTradingMarketplace(searchParams: Record<string, any> = {}) {
      const config = useRuntimeConfig();
      
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
        
        // Set hideBasicLands to true by default if not specified
        if (searchParams.hideBasicLands === undefined) {
          searchParams.hideBasicLands = true;
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
        let url = `${config.public.apiBaseUrl}/user-cards/trading/marketplace`;
        if (queryString) {
          url += `?${queryString}`;
        }
        
        // UPDATED: Use useFetch with SPA-friendly options - removed invalid 'redirect: false'
        const { data, error } = await useFetch(url, {
          method: 'GET',
          // Key parameters to prevent page refresh
          watch: false,
          key: `trading-marketplace-${JSON.stringify(searchParams)}`
        });
        
        if (error.value) {
          throw new Error(error.value.message || 'Failed to fetch trading marketplace');
        }
        
        const response = data.value as any;
        this.tradingMarketplace = response.tradingCards || [];
        this.tradingPagination = response.pagination || this.tradingPagination;
        return this.tradingMarketplace;
      } catch (err: any) {
        console.error('Error fetching trading marketplace:', err);
        this.error = err.message || 'Failed to fetch trading marketplace';
        return [];
      } finally {
        this.loading = false;
      }
    },

    async goToTradingPage(page: number, searchParams: Record<string, any> = {}) {
      if (page < 1 || page > this.tradingPagination.totalPages) return;
      
      const params = { ...searchParams, page };
      await this.fetchTradingMarketplace(params);
    },
    
    async nextTradingPage(searchParams: Record<string, any> = {}) {
      if (this.tradingPagination.currentPage < this.tradingPagination.totalPages) {
        await this.goToTradingPage(this.tradingPagination.currentPage + 1, searchParams);
      }
    },
    
    async prevTradingPage(searchParams: Record<string, any> = {}) {
      if (this.tradingPagination.currentPage > 1) {
        await this.goToTradingPage(this.tradingPagination.currentPage - 1, searchParams);
      }
    }
  }
  
});
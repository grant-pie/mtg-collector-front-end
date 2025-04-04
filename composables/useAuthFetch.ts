// composables/useAuthFetch.ts
import { useAuthStore } from '~/stores/auth';
import { useRuntimeConfig } from '#app';

export function useAuthFetch() {
  const authStore = useAuthStore();
  const config = useRuntimeConfig();
  
  return async (endpoint: string, options: any = {}) => {
    // Add authorization header if we have a token
    if (authStore.token) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${authStore.token}`
      };
    }
    
    const url = endpoint.startsWith('http') 
      ? endpoint 
      : `${config.public.apiBaseUrl}${endpoint}`;
    
    try {
      // Make the request
      return await $fetch(url, {
        ...options,
        credentials: 'include'
      });
    } catch (error: any) {
      // If we get a 401 and have a refresh token, try to refresh
      if (error.response?.status === 401 && authStore.refreshToken) {
        // Try to refresh the token
        const refreshSuccess = await authStore.refreshAccessToken();
        
        if (refreshSuccess) {
          // Retry the original request with new token
          options.headers = {
            ...options.headers,
            Authorization: `Bearer ${authStore.token}`
          };
          
          return await $fetch(url, {
            ...options,
            credentials: 'include'
          });
        }
      }
      
      // If we can't refresh or it's another error, throw it
      throw error;
    }
  };
}
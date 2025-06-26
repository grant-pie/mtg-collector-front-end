// composables/useAuthFetch.ts
import { useAuthStore } from '~/stores/auth';
import { useRuntimeConfig } from '#app';

export function useAuthFetch() {
  const authStore = useAuthStore();
  const config = useRuntimeConfig();
  
  return async (endpoint: string, options: any = {}) => {
    // Prepare headers
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add authorization header if we have a token
    if (authStore.token) {
      headers.Authorization = `Bearer ${authStore.token}`;
    }
    
    const url = endpoint.startsWith('http') 
      ? endpoint 
      : `${config.public.apiBaseUrl}${endpoint}`;
    
    // Prepare the request options
    const requestOptions = {
      ...options,
      headers,
      credentials: 'include' as RequestCredentials,
    };

    // Handle body serialization for non-GET requests
    if (options.body && typeof options.body === 'object') {
      requestOptions.body = JSON.stringify(options.body);
    }
    
    console.log('Making request to:', url);
    console.log('Request options:', requestOptions);
    
    try {
      // Make the request
      const response = await $fetch(url, requestOptions);
      console.log('Request successful:', response);
      return response;
    } catch (error: any) {
      console.error('Request failed:', error);
      console.error('Error response:', error.response);
      console.error('Error data:', error.data);
      
      // If we get a 401 and have a refresh token, try to refresh
      if (error.response?.status === 401 && authStore.refreshToken) {
        console.log('Attempting token refresh...');
        // Try to refresh the token
        const refreshSuccess = await authStore.refreshAccessToken();
        
        if (refreshSuccess) {
          console.log('Token refresh successful, retrying request...');
          // Retry the original request with new token
          const retryHeaders = {
            ...headers,
            Authorization: `Bearer ${authStore.token}`
          };
          
          const retryOptions = {
            ...requestOptions,
            headers: retryHeaders,
          };
          
          return await $fetch(url, retryOptions);
        } else {
          console.log('Token refresh failed');
        }
      }
      
      // If we can't refresh or it's another error, throw it
      throw error;
    }
  };
}
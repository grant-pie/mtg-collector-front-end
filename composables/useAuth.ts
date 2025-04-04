// composables/useAuth.ts
import { useAuthStore } from '~/stores/auth';
import { useAuthFetch } from '~/composables/useAuthFetch';
import { computed } from 'vue';
import { useRuntimeConfig } from '#app';

export const useAuth = () => {
  const authStore = useAuthStore();
  const authFetch = useAuthFetch();
  const config = useRuntimeConfig();
  
  const initAuth = async () => {
    await authStore.initAuth();
  };
  
  const handleAuthCallback = async (code: string) => {
    try {
      // Use the authFetch wrapper for better error handling
      const response = await authFetch('/auth/google/callback', {
        method: 'GET',
        params: { code }
      });
      
      if (response.token) {
        authStore.setToken(response.token);
        // If there's a refresh token in the response, set it
        if (response.refreshToken) {
          authStore.setRefreshToken(response.refreshToken);
        }
        await authStore.fetchUser();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Auth callback error:', error);
      return false;
    }
  };
  
  // Add the authFetch to the returned object so it can be used elsewhere
  return {
    isAuthenticated: computed(() => authStore.isAuthenticated),
    isAdmin: computed(() => authStore.isAdmin),
    user: computed(() => authStore.user),
    loading: computed(() => authStore.loading),
    error: computed(() => authStore.error),
    rememberMe: computed({
      get: () => authStore.rememberMe,
      set: (value) => authStore.setRememberMe(value)
    }),
    initAuth,
    handleAuthCallback,
    logout: () => authStore.logout(),
    startGoogleAuth: () => authStore.startGoogleAuth(),
    fetchUser: () => authStore.fetchUser(),
    // Add the authFetch function to be used by components
    fetch: authFetch
  };
};
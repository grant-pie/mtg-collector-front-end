import { useAuthStore } from '~/stores/auth';

export const useAuth = () => {
  const authStore = useAuthStore();
  
  const initAuth = async () => {
    await authStore.initAuth();
  };
  
  const handleAuthCallback = async (code: string) => {
    try {
      const response = await $fetch(`${useRuntimeConfig().public.apiBaseUrl}/auth/google/callback`, {
        method: 'GET',
        params: { code }
      });
      
      if (response.token) {
        authStore.setToken(response.token);
        await authStore.fetchUser();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Auth callback error:', error);
      return false;
    }
  };
  
  return {
    isAuthenticated: computed(() => authStore.isAuthenticated),
    isAdmin: computed(() => authStore.isAdmin),
    user: computed(() => authStore.user),
    loading: computed(() => authStore.loading),
    error: computed(() => authStore.error),
    initAuth,
    handleAuthCallback,
    logout: authStore.logout
  };
};
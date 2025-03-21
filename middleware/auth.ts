// middleware/auth.ts
import { useAuthStore } from '~/stores/auth';

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore();
  
  // Initialize auth if not already done
  if (!authStore.isAuthenticated && process.client) {
    await authStore.initAuth();
  }
  
  // If still not authenticated after init, redirect to login
  if (!authStore.isAuthenticated) {
    return navigateTo('/login');
  }
});
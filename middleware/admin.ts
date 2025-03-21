// middleware/admin.ts
import { useAuthStore } from '~/stores/auth';

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore();
  
  // Initialize auth if not already done
  if (!authStore.isAuthenticated && process.client) {
    await authStore.initAuth();
  }
  
  // If not authenticated, redirect to login
  if (!authStore.isAuthenticated) {
    return navigateTo('/login');
  }
  
  // If not admin, redirect to home
  if (!authStore.isAdmin) {
    return navigateTo('/');
  }
});
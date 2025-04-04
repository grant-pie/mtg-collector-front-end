// plugins/auth.ts
import { useAuth } from '~/composables/useAuth';

export default defineNuxtPlugin(async (nuxtApp) => {
  const auth = useAuth();
  
  // Initialize auth state from localStorage
  await auth.initAuth();
  
  // Add global access for templates
  nuxtApp.provide('auth', auth);
});
import { useAuthStore } from '~/stores/auth';

export default defineNuxtPlugin(async (nuxtApp) => {
  // Only run on client
  if (process.client) {
    const authStore = useAuthStore();
    
    // Check token when the app starts
    const checkToken = async () => {
      try {
        // Skip if not authenticated or no refresh token
        if (!authStore.token || !authStore.refreshToken) return;
        
        // Parse the JWT to check expiration
        const payload = JSON.parse(atob(authStore.token.split('.')[1]));
        const expTime = payload.exp * 1000; // Convert to milliseconds
        const currentTime = Date.now();
        const timeUntilExpiry = expTime - currentTime;
        
        console.log(`Token expires in ${Math.floor(timeUntilExpiry / 60000)} minutes`);
        
        // If token expires in less than 15 minutes, refresh it
        if (timeUntilExpiry < 15 * 60 * 1000) {
          console.log('Token will expire soon, refreshing...');
          await authStore.refreshAccessToken();
        }
      } catch (error) {
        console.error('Error checking token expiration:', error);
      }
    };
    
    // Check immediately
    checkToken();
    
    // Then check periodically if remember me is enabled
    if (authStore.rememberMe) {
      const interval = setInterval(checkToken, 10 * 60 * 1000); // Every 10 minutes
      
      // Clean up when app unmounts
      nuxtApp.hook('app:unmount', () => {
        clearInterval(interval);
      });
    }
  }
});
// plugins/websocket.client.ts
import { defineNuxtPlugin } from '#app';
import { useAuthStore } from '~/stores/auth';
import { useWebSocketService } from '~/services/websocket';

export default defineNuxtPlugin(async (nuxtApp) => {
  const authStore = useAuthStore();
  const wsService = useWebSocketService();

  // Initialize WebSocket connection if user is authenticated
  if (authStore.isAuthenticated) {
    wsService.connect();
  }

  // Watch for authentication state changes
  const unwatch = authStore.$subscribe((mutation, state) => {
    if (state.token) {
      wsService.connect();
    } else {
      wsService.disconnect();
    }
  });

  // Clean up on app unmount
  nuxtApp.hook('app:unmount', () => {
    wsService.disconnect();
    unwatch();
  });
});
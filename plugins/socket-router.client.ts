// plugins/socket-router.client.ts
export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.hook('app:created', () => {
      // Access the router
      const router = useRouter();
      
      // Add a navigation guard to ignore Socket.IO paths
      router.beforeEach((to, from, next) => {
        // Ignore socket.io requests to prevent Vue Router warnings
        if (to.fullPath.includes('/socket.io/')) {
          return;
        }
        next();
      });
    });
  });
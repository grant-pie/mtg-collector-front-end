// services/websocket.js
import { io } from 'socket.io-client';
import { useAuthStore } from '~/stores/auth';

export const useWebSocketService = () => {
  let socket = null;
  
  const connect = () => {
    const authStore = useAuthStore();
    
    // Create Socket.IO instance with fixed configuration
    const config = useRuntimeConfig();
    const baseUrl = config.public.wsBaseUrl;
    
    // Create socket with correct configuration
    socket = io(baseUrl, {
      path: '/socket.io/',
      namespace: '/notifications',
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      forceNew: true,
      auth: {
        token: authStore.token
      },
      transports: ['websocket'], // Force WebSocket transport only
      upgrade: false // Disable transport upgrades
    });
    
    // Set up event listeners
    socket.on('connect', () => {
      console.log('WebSocket connected');
      socket.emit('getUnreadCount');
    });
    
    socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      // Try to reconnect with a delay to prevent rapid reconnection attempts
      setTimeout(() => {
        if (socket) socket.connect();
      }, 3000);
    });
    
    // Add more detailed error handling
    socket.io.on("error", (error) => {
      console.error('Socket.IO transport error:', error);
    });
    
    socket.io.on("reconnect_attempt", (attempt) => {
      console.log(`Socket.IO reconnect attempt #${attempt}`);
    });
    
    socket.io.on("reconnect_failed", () => {
      console.error('Socket.IO reconnect failed after all attempts');
    });
    
    socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });
    
    // Event listeners for notifications
    socket.on('notification', (notification) => {
      console.log('New notification received:', notification);
      // Handle new notification (you can emit to a Pinia store or use other methods)
    });
    
    socket.on('unreadCount', ({ count }) => {
      console.log('Unread notifications count:', count);
      // Update unread count in your UI
    });
    
    socket.on('notificationRead', ({ id }) => {
      console.log('Notification marked as read:', id);
      // Update your UI accordingly
    });
  };
  
  const disconnect = () => {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  };
  
  const getSocket = () => socket;
  
  const sendMessage = (event, data) => {
    if (socket && socket.connected) {
      socket.emit(event, data);
    } else {
      console.warn('Cannot send message, socket not connected');
    }
  };
  
  const markAsRead = (notificationId) => {
    sendMessage('markAsRead', { notificationId });
  };
  
  const refreshUnreadCount = () => {
    sendMessage('getUnreadCount');
  };
  
  return {
    connect,
    disconnect,
    getSocket,
    sendMessage,
    markAsRead,
    refreshUnreadCount
  };
};
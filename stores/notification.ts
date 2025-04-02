// stores/notification.ts
import { defineStore } from 'pinia';
import { useAuthStore } from './auth';
import { useRuntimeConfig } from '#app';

interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  markAsReadLoading: boolean;
  markAsReadError: string | null;
}

export const useNotificationStore = defineStore('notification', {
  state: (): NotificationState => ({
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null,
    markAsReadLoading: false,
    markAsReadError: null,
  }),
  
  getters: {
    unreadNotifications(): Notification[] {
      return this.notifications.filter(notification => !notification.read);
    },
    
    readNotifications(): Notification[] {
      return this.notifications.filter(notification => notification.read);
    },
    
    sortedNotifications(): Notification[] {
      return [...this.notifications].sort((a, b) => {
        // Sort by read status (unread first) and then by date (newest first)
        if (a.read !== b.read) return a.read ? 1 : -1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    }
  },
  
  actions: {
    async fetchNotifications() {
      const authStore = useAuthStore();
      
      if (!authStore.token) {
        this.error = 'Authentication required';
        return;
      }
      
      this.loading = true;
      this.error = null;
      
      try {
        const config = useRuntimeConfig();
        const response = await $fetch<Notification[]>(`${config.public.apiBaseUrl}/notifications/my`, {
          headers: {
            Authorization: `Bearer ${authStore.token}`
          }
        });
        
        this.notifications = response;
      } catch (err) {
        console.error('Error fetching notifications:', err);
        this.error = 'Failed to load notifications';
        
        // If unauthorized, clear auth
        if ((err as any)?.response?.status === 401) {
          authStore.logout();
        }
      } finally {
        this.loading = false;
      }
    },
    
    async fetchUnreadCount() {
      const authStore = useAuthStore();
      
      if (!authStore.token) {
        return;
      }
      
      try {
        const config = useRuntimeConfig();
        const response = await $fetch<{ count: number }>(`${config.public.apiBaseUrl}/notifications/my/count`, {
          headers: {
            Authorization: `Bearer ${authStore.token}`
          }
        });
        
        this.unreadCount = response.count;
      } catch (err) {
        console.error('Error fetching unread count:', err);
        
        // If unauthorized, clear auth
        if ((err as any)?.response?.status === 401) {
          authStore.logout();
        }
      }
    },
    
    async markAsRead(id: string) {
      const authStore = useAuthStore();
      
      if (!authStore.token) {
        this.markAsReadError = 'Authentication required';
        return false;
      }
      
      this.markAsReadLoading = true;
      this.markAsReadError = null;
      
      try {
        const config = useRuntimeConfig();
        await $fetch(`${config.public.apiBaseUrl}/notifications/${id}/read`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${authStore.token}`
          }
        });
        
        // Update local state
        const notification = this.notifications.find(n => n.id === id);
        if (notification) {
          notification.read = true;
        }
        
        // Update unread count
        this.unreadCount = Math.max(0, this.unreadCount - 1);
        
        return true;
      } catch (err) {
        console.error('Error marking notification as read:', err);
        this.markAsReadError = 'Failed to mark notification as read';
        return false;
      } finally {
        this.markAsReadLoading = false;
      }
    },
    
    async markAllAsRead() {
      const authStore = useAuthStore();
      
      if (!authStore.token) {
        this.markAsReadError = 'Authentication required';
        return false;
      }
      
      this.markAsReadLoading = true;
      this.markAsReadError = null;
      
      try {
        const config = useRuntimeConfig();
        await $fetch(`${config.public.apiBaseUrl}/notifications/my/read-all`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${authStore.token}`
          }
        });
        
        // Update local state
        this.notifications.forEach(notification => {
          notification.read = true;
        });
        
        // Update unread count
        this.unreadCount = 0;
        
        return true;
      } catch (err) {
        console.error('Error marking all notifications as read:', err);
        this.markAsReadError = 'Failed to mark all notifications as read';
        return false;
      } finally {
        this.markAsReadLoading = false;
      }
    },
    
    async deleteNotification(id: string) {
      const authStore = useAuthStore();
      
      if (!authStore.token) {
        this.error = 'Authentication required';
        return false;
      }
      
      try {
        const config = useRuntimeConfig();
        await $fetch(`${config.public.apiBaseUrl}/notifications/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${authStore.token}`
          }
        });
        
        // Remove from local state
        const index = this.notifications.findIndex(n => n.id === id);
        if (index !== -1) {
          const wasUnread = !this.notifications[index].read;
          this.notifications.splice(index, 1);
          
          // Update unread count if needed
          if (wasUnread) {
            this.unreadCount = Math.max(0, this.unreadCount - 1);
          }
        }
        
        return true;
      } catch (err) {
        console.error('Error deleting notification:', err);
        this.error = 'Failed to delete notification';
        return false;
      }
    },
    
    // Method to add a new notification (e.g., from WebSocket)
    addNotification(notification: Notification) {
      this.notifications.unshift(notification);
      
      if (!notification.read) {
        this.unreadCount++;
      }
      
      // Optionally sort notifications after adding
      this.notifications = [...this.notifications].sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    },
    
    // Reset notification state
    clearNotifications() {
      this.notifications = [];
      this.unreadCount = 0;
      this.error = null;
    }
  }
});
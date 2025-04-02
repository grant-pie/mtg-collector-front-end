<!-- components/NotificationBell.vue -->
<template>
    <div class="notification-bell">
      <button @click="toggleDropdown" class="bell-button">
        <span class="icon">🔔</span>
        <span v-if="notificationStore.unreadCount > 0" class="badge">{{ notificationStore.unreadCount }}</span>
      </button>
  
      <div v-if="isDropdownOpen" class="notification-dropdown">
        <div class="notification-header">
          <h3>Notifications</h3>
          <button 
            v-if="notificationStore.unreadCount > 0" 
            @click="markAllAsRead" 
            :disabled="notificationStore.markAsReadLoading"
            class="mark-read-button"
          >
            Mark all as read
          </button>
        </div>
  
        <div v-if="notificationStore.loading" class="notification-loading">
          Loading...
        </div>
        
        <div v-else-if="notificationStore.error" class="notification-error">
          {{ notificationStore.error }}
        </div>
  
        <div v-else-if="notificationStore.notifications.length === 0" class="no-notifications">
          No notifications
        </div>
  
        <ul v-else class="notification-list">
          <li 
            v-for="notification in notificationStore.sortedNotifications" 
            :key="notification.id" 
            :class="{ 'unread': !notification.read }"
            class="notification-item"
          >
            <div class="notification-content" @click="viewNotification(notification)">
              <p class="notification-title">{{ notification.title }}</p>
              <p class="notification-message">{{ notification.message }}</p>
              <p class="notification-time">{{ formatTime(notification.createdAt) }}</p>
            </div>
            <div class="notification-actions">
              <button 
                v-if="!notification.read" 
                @click.stop="markAsRead(notification.id)"
                class="mark-read-button"
              >
                Mark as read
              </button>
              <button 
                @click.stop="deleteNotification(notification.id)"
                class="delete-button"
              >
                Delete
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue';
  import { useNotificationStore } from '~/stores/notification';
  
  const notificationStore = useNotificationStore();
  const isDropdownOpen = ref(false);
  
  // Fetch notifications on component mount
  onMounted(async () => {
    await notificationStore.fetchNotifications();
    await notificationStore.fetchUnreadCount();
  });
  
  // Close dropdown when clicking outside
  const handleClickOutside = (event: MouseEvent) => {
    const dropdown = document.querySelector('.notification-bell');
    if (dropdown && !dropdown.contains(event.target as Node)) {
      isDropdownOpen.value = false;
    }
  };
  
  onMounted(() => {
    document.addEventListener('click', handleClickOutside);
  });
  
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
  });
  
  // Toggle dropdown visibility
  const toggleDropdown = () => {
    isDropdownOpen.value = !isDropdownOpen.value;
    if (isDropdownOpen.value) {
      notificationStore.fetchNotifications();
    }
  };
  
  // Format timestamp
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
  
    if (diffMins < 60) {
      return diffMins === 0 ? 'Just now' : `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };
  
  // Mark a notification as read
  const markAsRead = async (id: string) => {
    await notificationStore.markAsRead(id);
  };
  
  // Mark all notifications as read
  const markAllAsRead = async () => {
    await notificationStore.markAllAsRead();
  };
  
  // View a notification
  const viewNotification = async (notification: any) => {
    // If unread, mark as read
    if (!notification.read) {
      await notificationStore.markAsRead(notification.id);
    }
    
    // Handle notification based on type
    // This is just an example, you'll need to implement your own logic
    // based on your notification types
    switch (notification.type) {
      case 'MESSAGE':
        // Navigate to messages
        break;
      case 'TASK':
        // Navigate to task
        break;
      default:
        // Default behavior
        break;
    }
  };
  
  // Delete a notification
  const deleteNotification = async (id: string) => {
    await notificationStore.deleteNotification(id);
  };
  </script>
  
  <style scoped>
  .notification-bell {
    position: relative;
  }
  
  .bell-button {
    background: none;
    border: none;
    cursor: pointer;
    position: relative;
    padding: 10px;
  }
  
  .badge {
    position: absolute;
    top: 0;
    right: 0;
    background-color: red;
    color: white;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
  }
  
  .notification-dropdown {
    position: absolute;
    right: 0;
    top: 100%;
    width: 320px;
    max-height: 400px;
    overflow-y: auto;
    background-color: white;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    z-index: 1000;
  }
  
  .notification-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #eee;
  }
  
  .notification-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .notification-item {
    padding: 10px;
    border-bottom: 1px solid #eee;
  }
  
  .notification-item.unread {
    background-color: #f0f7ff;
  }
  
  .notification-title {
    font-weight: bold;
    margin: 0 0 5px 0;
  }
  
  .notification-message {
    margin: 0 0 5px 0;
    color: #666;
  }
  
  .notification-time {
    font-size: 12px;
    color: #999;
    margin: 0;
  }
  
  .notification-actions {
    display: flex;
    justify-content: flex-end;
    gap: 5px;
    margin-top: 5px;
  }
  
  .mark-read-button {
    background-color: transparent;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 2px 5px;
    font-size: 12px;
    cursor: pointer;
  }
  
  .delete-button {
    background-color: transparent;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 2px 5px;
    font-size: 12px;
    color: #ff4d4f;
    cursor: pointer;
  }
  
  .notification-loading,
  .notification-error,
  .no-notifications {
    padding: 20px;
    text-align: center;
    color: #666;
  }
  </style>
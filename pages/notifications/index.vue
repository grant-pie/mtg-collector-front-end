<template>
    <div>
      <Header 
        title="Notifications Management" 
        subtitle="View and send notifications"
      />
      
      <div class="mt-8">
        <!-- Create Notification Form -->
        <div class="bg-white p-6 rounded shadow-md mb-8">
          <h2 class="text-2xl font-bold mb-4">Create New Notification</h2>
          
          <form @submit.prevent="createNotification">
            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div class="col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  v-model="newNotification.title"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div class="col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  v-model="newNotification.message"
                  required
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  v-model="newNotification.type"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="SYSTEM">System</option>
                  <option value="INFO">Information</option>
                  <option value="WARNING">Warning</option>
                  <option value="ALERT">Alert</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  User
                </label>
                <select
                  v-model="newNotification.userId"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Users</option>
                  <option v-for="user in users" :key="user.id" :value="user.id">
                    {{ user.firstName }} {{ user.lastName }} ({{ user.email }})
                  </option>
                </select>
              </div>
              
              <div class="col-span-2">
                <button
                  type="submit"
                  class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :disabled="createLoading"
                >
                  {{ createLoading ? 'Sending...' : 'Send Notification' }}
                </button>
                
                <div v-if="createError" class="mt-3 text-red-600">
                  {{ createError }}
                </div>
                
                <div v-if="createSuccess" class="mt-3 text-green-600">
                  Notification sent successfully!
                </div>
              </div>
            </div>
          </form>
        </div>
        
        <!-- Notifications List -->
        <div class="bg-white p-6 rounded shadow-md">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-2xl font-bold">All Notifications</h2>
            
            <div class="flex items-center gap-2">
              <label class="text-sm font-medium text-gray-700">
                Filter by User:
              </label>
              <select
                v-model="filters.userId"
                class="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Users</option>
                <option v-for="user in users" :key="user.id" :value="user.id">
                  {{ user.firstName }} {{ user.lastName }}
                </option>
              </select>
              
              <label class="text-sm font-medium text-gray-700 ml-4">
                Show:
              </label>
              <select
                v-model="filters.read"
                class="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All</option>
                <option :value="false">Unread</option>
                <option :value="true">Read</option>
              </select>
            </div>
          </div>
          
          <div v-if="loading" class="text-center py-10">
            <p>Loading notifications...</p>
          </div>
          
          <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {{ error }}
          </div>
          
          <div v-else-if="filteredNotifications.length === 0" class="text-center py-6">
            <p>No notifications found.</p>
          </div>
          
          <div v-else>
            <table class="min-w-full bg-white">
              <thead>
                <tr>
                  <th class="py-2 px-4 border-b text-left">Title</th>
                  <th class="py-2 px-4 border-b text-left">Message</th>
                  <th class="py-2 px-4 border-b text-left">Type</th>
                  <th class="py-2 px-4 border-b text-left">User</th>
                  <th class="py-2 px-4 border-b text-left">Created</th>
                  <th class="py-2 px-4 border-b text-left">Status</th>
                  <th class="py-2 px-4 border-b text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="notification in filteredNotifications" 
                  :key="notification.id"
                  :class="{'bg-blue-50': !notification.read}"
                >
                  <td class="py-2 px-4 border-b font-medium">{{ notification.title }}</td>
                  <td class="py-2 px-4 border-b">
                    {{ notification.message.length > 50 
                      ? notification.message.substring(0, 50) + '...' 
                      : notification.message }}
                  </td>
                  <td class="py-2 px-4 border-b">
                    <span 
                      class="px-2 py-1 text-xs font-bold rounded" 
                      :class="getTypeClass(notification.type)"
                    >
                      {{ notification.type }}
                    </span>
                  </td>
                  <td class="py-2 px-4 border-b">
                    {{ getUserName(notification.userId) }}
                  </td>
                  <td class="py-2 px-4 border-b">
                    {{ formatDate(notification.createdAt) }}
                  </td>
                  <td class="py-2 px-4 border-b">
                    <span 
                      class="px-2 py-1 text-xs font-bold rounded"
                      :class="notification.read ? 'bg-gray-200 text-gray-800' : 'bg-green-200 text-green-800'"
                    >
                      {{ notification.read ? 'Read' : 'Unread' }}
                    </span>
                  </td>
                  <td class="py-2 px-4 border-b text-center">
                    <button 
                      @click="viewNotificationDetails(notification)"
                      class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-sm mr-2"
                    >
                      View
                    </button>
                    <button 
                      @click="deleteNotification(notification.id)"
                      class="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <!-- Notification Details Modal -->
      <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full mx-4">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-bold">{{ selectedNotification?.title }}</h3>
            <button @click="showModal = false" class="text-gray-500 hover:text-gray-700">
              <span class="text-2xl">&times;</span>
            </button>
          </div>
          
          <div class="mb-4">
            <p class="text-sm text-gray-500">
              {{ formatDate(selectedNotification?.createdAt) }}
              • {{ getUserName(selectedNotification?.userId) }}
              • {{ selectedNotification?.type }}
            </p>
          </div>
          
          <div class="mb-6">
            <p class="whitespace-pre-wrap">{{ selectedNotification?.message }}</p>
          </div>
          
          <div class="flex justify-end">
            <button 
              @click="showModal = false" 
              class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
            >
              Close
            </button>
            <button 
              v-if="!selectedNotification?.read"
              @click="markAsRead(selectedNotification?.id)"
              class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Mark as Read
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted, watch } from 'vue';
  import { storeToRefs } from 'pinia';
  import { useUserStore } from '~/stores/user';
  import { useAuthStore } from '~/stores/auth';
  import { useRuntimeConfig } from '#app';
  import Header from '~/components/Layout/Header.vue';
  
  definePageMeta({
    middleware: ['admin']
  });
  
  // Store references
  const userStore = useUserStore();
  const authStore = useAuthStore();
  const { users } = storeToRefs(userStore);
  
  // Notification state
  const notifications = ref([]);
  const loading = ref(false);
  const error = ref(null);
  
  // Filter state
  const filters = ref({
    userId: '',
    read: ''
  });
  
  // Create notification state
  const newNotification = ref({
    title: '',
    message: '',
    type: 'INFO',
    userId: ''
  });
  const createLoading = ref(false);
  const createError = ref(null);
  const createSuccess = ref(false);
  
  // Modal state
  const showModal = ref(false);
  const selectedNotification = ref(null);
  
  const filteredNotifications = computed(() => {
    let filtered = [...notifications.value];
    
    if (filters.value.userId) {
      filtered = filtered.filter(n => n.userId === filters.value.userId);
    }
    
    if (filters.value.read !== '') {
      filtered = filtered.filter(n => n.read === filters.value.read);
    }
    
    return filtered;
  });
  
  // Fetch all notifications
  async function fetchNotifications() {
    if (!authStore.token) return;
    
    loading.value = true;
    error.value = null;
    
    try {
      const config = useRuntimeConfig();
      const response = await $fetch(`${config.public.apiBaseUrl}/notifications`, {
        headers: {
          Authorization: `Bearer ${authStore.token}`
        },
        params: {
          // Add any query parameters if needed
        }
      });
      
      notifications.value = response;
    } catch (err) {
      console.error('Error fetching notifications:', err);
      error.value = 'Failed to load notifications';
    } finally {
      loading.value = false;
    }
  }
  
  // Create a new notification
  async function createNotification() {
    if (!authStore.token) return;
    
    createLoading.value = true;
    createError.value = null;
    createSuccess.value = false;
    
    try {
      const config = useRuntimeConfig();
      const payload = {
        ...newNotification.value,
        // If userId is empty, it means send to all users - backend should handle this logic
        userId: newNotification.value.userId || null
      };
      
      await $fetch(`${config.public.apiBaseUrl}/notifications`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authStore.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      // Reset form
      newNotification.value = {
        title: '',
        message: '',
        type: 'INFO',
        userId: ''
      };
      
      createSuccess.value = true;
      
      // Refresh notifications list
      await fetchNotifications();
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        createSuccess.value = false;
      }, 3000);
    } catch (err) {
      console.error('Error creating notification:', err);
      createError.value = err.data?.message || 'Failed to create notification';
    } finally {
      createLoading.value = false;
    }
  }
  
  // Delete a notification
  async function deleteNotification(id) {
    if (!authStore.token || !id) return;
    
    if (!confirm('Are you sure you want to delete this notification?')) {
      return;
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
      notifications.value = notifications.value.filter(n => n.id !== id);
    } catch (err) {
      console.error('Error deleting notification:', err);
      alert('Failed to delete notification');
    }
  }
  
  // Mark notification as read
  async function markAsRead(id) {
    if (!authStore.token || !id) return;
    
    try {
      const config = useRuntimeConfig();
      await $fetch(`${config.public.apiBaseUrl}/notifications/${id}/read`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${authStore.token}`
        }
      });
      
      // Update local state
      const notification = notifications.value.find(n => n.id === id);
      if (notification) {
        notification.read = true;
      }
      
      // Close modal
      if (showModal.value) {
        showModal.value = false;
      }
    } catch (err) {
      console.error('Error marking notification as read:', err);
      alert('Failed to mark notification as read');
    }
  }
  
  // View notification details
  function viewNotificationDetails(notification) {
    selectedNotification.value = notification;
    showModal.value = true;
  }
  
  // Format date
  function formatDate(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date);
  }
  
  // Get user name from ID
  function getUserName(userId) {
    if (!userId) return 'All Users';
    
    const user = users.value.find(u => u.id === userId);
    return user ? `${user.firstName} ${user.lastName}` : 'Unknown User';
  }
  
  // Get type class for styling
  function getTypeClass(type) {
    switch (type) {
      case 'INFO':
        return 'bg-blue-200 text-blue-800';
      case 'WARNING':
        return 'bg-yellow-200 text-yellow-800';
      case 'ALERT':
        return 'bg-red-200 text-red-800';
      case 'SYSTEM':
        return 'bg-purple-200 text-purple-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  }
  
  // Lifecycle hooks
  onMounted(async () => {
    // Fetch users first so we can display user names
    if (users.value.length === 0) {
      await userStore.fetchAllUsers();
    }
    
    // Then fetch notifications
    await fetchNotifications();
  });
  
  // Reset success message when form changes
  watch(newNotification, () => {
    createSuccess.value = false;
  }, { deep: true });
  </script>
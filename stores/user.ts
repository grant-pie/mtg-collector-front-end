// stores/user.ts
import { defineStore } from 'pinia';
import { useAuthStore } from './auth';
import { useRuntimeConfig } from '#app';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  picture?: string;
  username?: string;
  role: string;
  createdAt?: string;
}

interface PublicUser {
  id: string;
  username: string;
}

interface UserState {
  users: User[];
  publicUsernames: PublicUser[];
  loading: boolean;
  error: string | null;
  usernameUpdateLoading: boolean;
  usernameUpdateError: string | null;
  usernameUpdateSuccess: boolean;
  usernamesLoading: boolean;
  usernamesError: string | null;
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    users: [],
    publicUsernames: [],
    loading: false,
    error: null,
    usernameUpdateLoading: false,
    usernameUpdateError: null,
    usernameUpdateSuccess: false,
    usernamesLoading: false,
    usernamesError: null
  }),
  
  actions: {
    async fetchAllUsers() {
      const authStore = useAuthStore();
      
      // Only admins can fetch all users
      if (!authStore.isAdmin) {
        this.error = 'Unauthorized: Admin access required';
        return;
      }
      
      if (!authStore.token) {
        this.error = 'Authentication required';
        return;
      }
      
      this.loading = true;
      this.error = null;
      
      try {
        const config = useRuntimeConfig();
        const response = await $fetch<User[]>(`${config.public.apiBaseUrl}/users`, {
          headers: {
            Authorization: `Bearer ${authStore.token}`
          }
        });
        
        this.users = response;
        console.log('Fetched users:', this.users);
      } catch (err) {
        console.error('Error fetching users:', err);
        this.error = 'Failed to load users';
      } finally {
        this.loading = false;
      }
    },

    async fetchAllUsernames() {
      this.usernamesLoading = true;
      this.usernamesError = null;
      
      try {
        const config = useRuntimeConfig();
        const response = await $fetch<PublicUser[]>(`${config.public.apiBaseUrl}/users/usernames`);
        
        this.publicUsernames = response;
        console.log('Fetched usernames:', this.publicUsernames);
      } catch (err) {
        console.error('Error fetching usernames:', err);
        this.usernamesError = 'Failed to load usernames';
      } finally {
        this.usernamesLoading = false;
      }
    },

    async updateUsername(username: string) {
      const authStore = useAuthStore();
      
      if (!authStore.token) {
        this.usernameUpdateError = 'Authentication required';
        return false;
      }
      
      this.usernameUpdateLoading = true;
      this.usernameUpdateError = null;
      this.usernameUpdateSuccess = false;
      
      try {
        const config = useRuntimeConfig();
        const response = await $fetch(`${config.public.apiBaseUrl}/users/username`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${authStore.token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username })
        });
        
        // Update the user in the auth store using the new method
        authStore.updateUserData({ username });
        
        this.usernameUpdateSuccess = true;
        return true;
      } catch (err: any) {
        console.error('Error updating username:', err);
        this.usernameUpdateError = err.data?.message || 'Failed to update username';
        return false;
      } finally {
        this.usernameUpdateLoading = false;
      }
    },

    resetUsernameUpdateState() {
      this.usernameUpdateLoading = false;
      this.usernameUpdateError = null;
      this.usernameUpdateSuccess = false;
    }
  }
});
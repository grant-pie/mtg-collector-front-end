import { defineStore } from 'pinia';
import { useRuntimeConfig } from '#app';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  picture?: string;
  username?: string;  // Added username field
  role?: string;
  createdAt?: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: null,
    user: null,
    loading: false,
    error: null
  }),
  
  getters: {
    isAuthenticated(): boolean {
      return !!this.token;
    },
    
    isAdmin(): boolean {
      return this.user?.role === 'admin';
    }
  },
  
  actions: {
    setToken(token: string): void {
      this.token = token;
      // Also store in localStorage for persistence
      if (process.client) {
        localStorage.setItem('token', token);
      }
    },
    
    setUser(user: User): void {
      this.user = user;
    },
    
    async fetchUser(): Promise<void> {
      if (!this.token) return;
      
      this.loading = true;
      this.error = null;
      
      try {
        const response = await $fetch<User>(`${useRuntimeConfig().public.apiBaseUrl}/auth/profile`, {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        });
        
        this.user = response;
      } catch (err) {
        console.error('Error fetching user:', err);
        this.error = 'Failed to load user profile';
        // If we get an authentication error, clear the token
        if ((err as any)?.response?.status === 401) {
          this.logout();
        }
      } finally {
        this.loading = false;
      }
    },
    
    async initAuth(): Promise<void> {
      // Check for token in localStorage
      if (process.client) {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
          this.token = storedToken;
          await this.fetchUser();
        }
      }
    },
    
    logout(): void {
      this.token = null;
      this.user = null;
      if (process.client) {
        localStorage.removeItem('token');
      }
    },
    
    // Method to update user data locally after changes (like username update)
    updateUserData(userData: Partial<User>): void {
      if (this.user) {
        this.user = { ...this.user, ...userData };
      }
    }
  }
});
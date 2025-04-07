import { defineStore } from 'pinia';
import { useRuntimeConfig } from '#app';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  picture?: string;
  username?: string;
  role?: string;
  createdAt?: string;
}

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
  rememberMe: boolean;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: null,
    refreshToken: null,
    user: null,
    loading: false,
    error: null,
    rememberMe: false
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
      // Store in localStorage always, it will be cleared on logout if needed
      if (process.client) {
        localStorage.setItem('token', token);
      }
    },
    
    setRefreshToken(refreshToken: string): void {
      this.refreshToken = refreshToken;
      // Store refresh token in localStorage always, it will be cleared on logout if needed
      if (process.client) {
        localStorage.setItem('refreshToken', refreshToken);
      }
    },
    
    setRememberMe(value: boolean): void {
      this.rememberMe = value;
      if (process.client) {
        localStorage.setItem('rememberMe', value.toString());
        
        // If rememberMe is set to false, remove persisted tokens
        if (!value) {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
        } else if (this.token) {
          // If it's set to true and we have tokens, persist them
          localStorage.setItem('token', this.token);
          if (this.refreshToken) {
            localStorage.setItem('refreshToken', this.refreshToken);
          }
        }
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
        // Import and use the fetch wrapper
        const { fetch: authFetch } = useAuth();
        const response = await authFetch('/auth/profile');
        this.user = response;
      } catch (err) {
        console.error('Error fetching user:', err);
        this.error = 'Failed to load user profile';
      } finally {
        this.loading = false;
      }
    },
    
    async refreshAccessToken(): Promise<boolean> {
      if (!this.refreshToken) {
        console.log('No refresh token available');
        return false;
      }
      
      try {
        const config = useRuntimeConfig();
        console.log('Attempting to refresh token with:', this.refreshToken.slice(0, 5) + '...');
        
        // Use $fetch which is Nuxt's wrapper around fetch
        const data = await $fetch(`${config.public.apiBaseUrl}/auth/refresh-token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: { refreshToken: this.refreshToken },
          credentials: 'include'
        });
        
        console.log('Refresh token response received:', !!data.access_token);
        
        // Handle the response
        if (data.access_token) {
          this.setToken(data.access_token);
          if (data.refresh_token) {
            this.setRefreshToken(data.refresh_token);
          }
          if (data.user) {
            this.setUser(data.user);
          }
          return true;
        }
        
        return false;
      } catch (error) {
        console.error('Token refresh failed:', error);
        // Only logout if this isn't just a network error
        if (error.response && error.response.status >= 400) {
          this.logout();
        }
        return false;
      }
    },
    
    async initAuth(): Promise<void> {
      if (process.client) {
        // First get the remember me preference
        const rememberedPref = localStorage.getItem('rememberMe');
        if (rememberedPref) {
          this.rememberMe = rememberedPref === 'true';
        }
        
        // Check for tokens
        const storedToken = localStorage.getItem('token');
        const storedRefreshToken = localStorage.getItem('refreshToken');
        
        // Check if token is expired by decoding it
        let isTokenExpired = true;
        if (storedToken) {
          try {
            // Parse JWT payload
            const payload = JSON.parse(atob(storedToken.split('.')[1]));
            // Check if token is expired
            isTokenExpired = payload.exp * 1000 < Date.now();
            
            console.log('Stored token expired:', isTokenExpired);
          } catch (error) {
            console.error('Error parsing stored token:', error);
            isTokenExpired = true;
          }
        }
        
        // If we have a refresh token and either no token or expired token
        if (storedRefreshToken && (isTokenExpired || !storedToken)) {
          console.log('Need to refresh the token');
          // Try to refresh the token first
          const refreshSuccess = await this.refreshAccessToken();
          
          if (refreshSuccess) {
            console.log('Token refresh successful');
            return; // We're authenticated now
          } else {
            console.log('Token refresh failed');
            // Clear any invalid tokens
            this.token = null;
            this.refreshToken = null;
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
          }
        } else if (storedToken && !isTokenExpired) {
          // Valid token exists, use it
          this.token = storedToken;
          if (storedRefreshToken) {
            this.refreshToken = storedRefreshToken;
          }
          
          // Fetch user data with the token
          try {
            await this.fetchUser();
            console.log('User fetched successfully with stored token');
          } catch (error) {
            console.error('Error fetching user with valid token:', error);
            // Token might still be invalid for some reason
            this.token = null;
            localStorage.removeItem('token');
          }
        }
      }
    },
    
    async startGoogleAuth(): Promise<void> {
      const config = useRuntimeConfig();
      
      try {
        // Set in session as a backup
        await fetch(`${config.public.apiBaseUrl}/auth/remember-me`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ rememberMe: this.rememberMe }),
        });
        
        // Important: Add remember_me to the URL query parameter
        window.location.href = `${config.public.apiBaseUrl}/auth/google?remember_me=${this.rememberMe}`;
      } catch (error) {
        console.error('Failed to set remember me preference:', error);
        // Still include the parameter in the URL as the primary method
        window.location.href = `${config.public.apiBaseUrl}/auth/google?remember_me=${this.rememberMe}`;
      }
    },
    
    async logout(): Promise<void> {
      // Call backend to invalidate refresh token
      if (this.token || this.refreshToken) {
        try {
          const config = useRuntimeConfig();
          await fetch(`${config.public.apiBaseUrl}/auth/logout`, {
            method: 'POST',
            credentials: 'include', // Important for cookies
            headers: {
              'Content-Type': 'application/json',
              ...(this.token ? { Authorization: `Bearer ${this.token}` } : {})
            }
          });
        } catch (error) {
          console.error('Logout error:', error);
        }
      }
      
      // Clear local state
      this.token = null;
      this.refreshToken = null;
      this.user = null;
      
      if (process.client) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        // Don't remove rememberMe preference
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
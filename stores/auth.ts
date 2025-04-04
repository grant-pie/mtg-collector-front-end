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
        this.logout();
        return false;
      }
      
      try {
        const config = useRuntimeConfig();
        
        // Use $fetch which is Nuxt's wrapper around fetch
        const data = await $fetch(`${config.public.apiBaseUrl}/auth/refresh-token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: { refreshToken: this.refreshToken }, // $fetch automatically stringifies
          credentials: 'include'
        });
        
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
        this.logout();
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
        
        if (storedRefreshToken) {
          // We have a refresh token, set it in store
          this.refreshToken = storedRefreshToken;
          
          if (storedToken) {
            // We also have an access token, set it
            this.token = storedToken;
            
            // Try to use the token to fetch user
            try {
              await this.fetchUser();
            } catch (error) {
              // If there's any error with the token, try refreshing
              console.log('Stored token might be expired, trying refresh');
              await this.refreshAccessToken();
            }
          } else {
            // No access token but we have refresh token
            console.log('No access token found, trying to refresh');
            await this.refreshAccessToken();
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
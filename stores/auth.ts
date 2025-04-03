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
      // Store in localStorage only if rememberMe is true
      if (process.client && this.rememberMe) {
        localStorage.setItem('token', token);
      }
    },
    
    setRefreshToken(refreshToken: string): void {
      this.refreshToken = refreshToken;
      // Store refresh token in localStorage only if rememberMe is true
      if (process.client && this.rememberMe) {
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
        const response = await $fetch<User>(`${useRuntimeConfig().public.apiBaseUrl}/auth/profile`, {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        });
        
        this.user = response;
      } catch (err) {
        console.error('Error fetching user:', err);
        this.error = 'Failed to load user profile';
        // If we get an authentication error, try to refresh token
        if ((err as any)?.response?.status === 401 && this.refreshToken) {
          const refreshSuccess = await this.refreshAccessToken();
          if (refreshSuccess) {
            // Try fetching user again with the new token
            try {
              const response = await $fetch<User>(`${useRuntimeConfig().public.apiBaseUrl}/auth/profile`, {
                headers: {
                  Authorization: `Bearer ${this.token}`
                }
              });
              
              this.user = response;
              // Clear error since we succeeded
              this.error = null;
            } catch (retryErr) {
              console.error('Error fetching user after token refresh:', retryErr);
              this.error = 'Failed to load user profile';
            }
          }
        }
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
        const response = await fetch(`${config.public.apiBaseUrl}/auth/refresh-token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ refreshToken: this.refreshToken }), // Include refreshToken in body
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Failed to refresh token');
        }
        
        const data = await response.json();
        
        // Handle the response with snake_case properties matching your backend
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
        
        if (storedToken) {
          this.token = storedToken;
          
          if (storedRefreshToken) {
            this.refreshToken = storedRefreshToken;
            
            // Try to fetch user with stored token
            await this.fetchUser();
            
            // If fetchUser set an error (probably due to expired token), try refreshing the token
            if (this.error && this.refreshToken) {
              const refreshSuccess = await this.refreshAccessToken();
              if (refreshSuccess) {
                // Clear previous error
                this.error = null;
                // Retry fetching user with new token
                await this.fetchUser();
              }
            }
          }
        }
      }
    },
    
    async startGoogleAuth(): Promise<void> {
      const config = useRuntimeConfig();
      
      try {
        // Send remember me preference to backend before starting OAuth flow
        await fetch(`${config.public.apiBaseUrl}/auth/remember-me`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ rememberMe: this.rememberMe }),
        });
        
        // Redirect to Google OAuth
        window.location.href = `${config.public.apiBaseUrl}/auth/google`;
      } catch (error) {
        console.error('Failed to set remember me preference:', error);
        // Still redirect even if preference setting fails
        window.location.href = `${config.public.apiBaseUrl}/auth/google`;
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
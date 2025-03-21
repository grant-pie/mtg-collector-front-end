import { useAuthStore } from '~/stores/auth';

export const apiGet = async (url: string, params: Record<string, any> = {}) => {
  const authStore = useAuthStore();
  const config = useRuntimeConfig();
  const baseURL = config.public.apiBaseUrl;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (authStore.token) {
    headers['Authorization'] = `Bearer ${authStore.token}`;
  }
  
  try {
    return await $fetch(`${baseURL}${url}`, {
      method: 'GET',
      headers,
      params,
    });
  } catch (error: any) {
    handleApiError(error);
    throw error;
  }
};

export const apiPost = async (url: string, data: any = {}) => {
  const authStore = useAuthStore();
  const config = useRuntimeConfig();
  const baseURL = config.public.apiBaseUrl;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (authStore.token) {
    headers['Authorization'] = `Bearer ${authStore.token}`;
  }
  
  try {
    return await $fetch(`${baseURL}${url}`, {
      method: 'POST',
      headers,
      body: data,
    });
  } catch (error: any) {
    handleApiError(error);
    throw error;
  }
};

export const apiDelete = async (url: string) => {
  const authStore = useAuthStore();
  const config = useRuntimeConfig();
  const baseURL = config.public.apiBaseUrl;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (authStore.token) {
    headers['Authorization'] = `Bearer ${authStore.token}`;
  }
  
  try {
    return await $fetch(`${baseURL}${url}`, {
      method: 'DELETE',
      headers,
    });
  } catch (error: any) {
    handleApiError(error);
    throw error;
  }
};

const handleApiError = (error: any) => {
  const authStore = useAuthStore();
  
  // Handle 401 Unauthorized errors
  if (error.response?.status === 401) {
    authStore.logout();
    navigateTo('/');
  }
  
  return error;
};
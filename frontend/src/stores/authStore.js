import { defineStore } from 'pinia';
import { ref } from 'vue';
import { apiClient } from '@stores/httpClients';

export const useAuthStore = defineStore('auth', () => {
  const loading = ref(false);

  const login = async ({ email, password }) => {
    loading.value = true;

    try {
      const response = await apiClient.post('/auth/login', { email, password });
      return response.data;
    } finally {
      loading.value = false;
    }
  };

  const verifyLoginPin = async ({ tempToken, pin }) => {
    loading.value = true;

    try {
      const response = await apiClient.post('/auth/verify-pin', {
        tempToken,
        pin,
      });
      return response.data;
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    login,
    verifyLoginPin,
  };
});

export default useAuthStore;

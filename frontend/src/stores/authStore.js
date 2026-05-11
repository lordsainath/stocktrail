import { defineStore } from 'pinia';
import { ref } from 'vue';
import { apiClient } from '@stores/httpClients';

export const useAuthStore = defineStore('auth', () => {
  const loading = ref(false);
  const step = ref('credentials');
  const tempToken = ref(sessionStorage.getItem('tempToken') || '');

  const persistTemp = (value) => {
    tempToken.value = value || '';
    if (value) sessionStorage.setItem('tempToken', value);
    else sessionStorage.removeItem('tempToken');
  };

  const startLogin = async ({ email, password }) => {
    loading.value = true;
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const temp = response?.data?.data?.tempToken || response?.data?.tempToken || response?.tempToken || '';
      if (temp) {
        persistTemp(temp);
        step.value = 'pin';
        return { success: true };
      }
      return { success: false, error: 'No temp token' };
    } catch (err) {
      return { success: false, error: err };
    } finally {
      loading.value = false;
    }
  };

  const verifyPin = async (pin) => {
    loading.value = true;
    try {
      const response = await apiClient.post('/auth/verify-pin', {
        tempToken: tempToken.value,
        pin,
      });

      const sessionPayload = response?.data?.data || response?.data || response?.data?.token || null;

      if (sessionPayload) {
        persistTemp('');
        step.value = 'credentials';
        return { success: true, session: sessionPayload };
      }

      return { success: false, error: 'Invalid session payload' };
    } catch (err) {
      return { success: false, error: err };
    } finally {
      loading.value = false;
    }
  };

  const backToCredentials = () => {
    persistTemp('');
    step.value = 'credentials';
  };

  const clearAuth = () => {
    persistTemp('');
    step.value = 'credentials';
    loading.value = false;
  };

  return {
    loading,
    step,
    tempToken,
    startLogin,
    verifyPin,
    backToCredentials,
    clearAuth,
  };
});

export default useAuthStore;

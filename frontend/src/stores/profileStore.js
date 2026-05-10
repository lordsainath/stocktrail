import { defineStore } from 'pinia';
import { ref } from 'vue';
import { apiClient } from '@stores/httpClients';

export const useProfileStore = defineStore('profile', () => {
  const loading = ref(false);

  const fetchCurrentProfile = async () => {
    loading.value = true;

    try {
      const response = await apiClient.get('/auth/me');
      return response.data;
    } finally {
      loading.value = false;
    }
  };

  const updateProfilePhoto = async (photoUrl) => {
    loading.value = true;

    try {
      const response = await apiClient.put('/auth/update-photo', { photoUrl });
      return response.data;
    } finally {
      loading.value = false;
    }
  };

  const updatePassword = async (password) => {
    loading.value = true;

    try {
      const response = await apiClient.put('/auth/update-password', { password });
      return response.data;
    } finally {
      loading.value = false;
    }
  };

  const updatePin = async (pin) => {
    loading.value = true;

    try {
      const response = await apiClient.put('/auth/update-pin', { pin });
      return response.data;
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    fetchCurrentProfile,
    updateProfilePhoto,
    updatePassword,
    updatePin,
  };
});

export default useProfileStore;

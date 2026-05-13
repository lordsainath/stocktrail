import { defineStore } from 'pinia';
import { computed, reactive, ref } from 'vue';
import { toast } from 'vue-sonner';

import useUserStore from '@stores/userStore';
import { apiClient } from '@api/httpClients';

export const useProfileStore = defineStore('profile', () => {
  const userStore = useUserStore();

  const loadingProfile = ref(false);

  const showProfileModal = ref(false);
  const showPasswordModal = ref(false);
  const showPinModal = ref(false);

  const profileForm = reactive({
    photoUrl: '',
    loading: false,
  });

  const passwordForm = reactive({
    loading: false,
  });

  const pinForm = reactive({
    loading: false,
  });

  const user = computed(() => userStore.user || {});

  const formattedAddress = computed(() => {
    const address = user.value?.address;

    if (!address) return 'No address available';

    return [address.street, address.city, address.state, address.country, address.zipCode]
      .filter(Boolean)
      .join(', ');
  });

  const openProfileModal = () => {
    profileForm.photoUrl = user.value?.photoUrl || '';
    showProfileModal.value = true;
  };

  const closeProfileModal = () => {
    showProfileModal.value = false;
  };

  const openPasswordModal = () => {
    showPasswordModal.value = true;
  };

  const closePasswordModal = () => {
    showPasswordModal.value = false;
  };

  const openPinModal = () => {
    showPinModal.value = true;
  };

  const closePinModal = () => {
    showPinModal.value = false;
  };

  const resetProfileForm = () => {
    profileForm.photoUrl = '';
  };

  const fetchCurrentProfile = async () => {
    try {
      loadingProfile.value = true;

      const response = await apiClient.get('/auth/me');

      if (response?.data?.data) {
        userStore.updateUser(response.data.data);
      }

      return response.data;
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to fetch profile');
    } finally {
      loadingProfile.value = false;
    }
  };

  const updateProfile = async (payload = null) => {
    const form = payload || profileForm;
    const photoUrl = (form.photoUrl || '').trim();

    if (!photoUrl) {
      toast.error('Profile image URL is required');
      return;
    }

    try {
      profileForm.loading = true;

      const response = await apiClient.put('/auth/update-photo', {
        photoUrl,
      });

      if (response?.data?.data) {
        userStore.updateUser(response.data.data);
      } else {
        userStore.updateUser({ photoUrl });
      }

      toast.success(response?.data?.message || 'Profile updated successfully');

      resetProfileForm();
      closeProfileModal();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update profile');
    } finally {
      profileForm.loading = false;
    }
  };

  const updatePassword = async (payload) => {
    const password = typeof payload === 'string' ? payload : payload?.password || '';

    if (!password.trim()) {
      toast.error('Password is required');
      return false;
    }

    passwordForm.loading = true;

    try {
      const response = await apiClient.put('/auth/update-password', {
        password,
      });

      toast.success(response?.data?.message || 'Password updated successfully');

      closePasswordModal();
      return true;
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update password');
      return false;
    } finally {
      passwordForm.loading = false;
    }
  };

  const updatePin = async (payload) => {
    const pinRaw = typeof payload === 'string' ? payload : payload?.pin || '';
    const pin = String(pinRaw).replace(/\D/g, '');

    if (pin.length !== 4) {
      toast.error('PIN must be exactly 4 digits');
      return false;
    }

    pinForm.loading = true;

    try {
      const response = await apiClient.put('/auth/update-pin', {
        pin,
      });

      userStore.updateUser({
        isPinSet: true,
      });

      toast.success(response?.data?.message || 'PIN updated successfully');

      closePinModal();
      return true;
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update PIN');
      return false;
    } finally {
      pinForm.loading = false;
    }
  };

  return {
    loadingProfile,
    showProfileModal,
    showPasswordModal,
    showPinModal,
    profileForm,
    passwordForm,
    pinForm,
    user,
    formattedAddress,
    openProfileModal,
    closeProfileModal,
    openPasswordModal,
    closePasswordModal,
    openPinModal,
    closePinModal,
    fetchCurrentProfile,
    updateProfile,
    updatePassword,
    updatePin,
  };
});

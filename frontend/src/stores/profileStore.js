// Imports

import { defineStore } from 'pinia';
import { computed, reactive, ref } from 'vue';
import { toast } from 'vue-sonner';

import useUserStore from '@stores/userStore';
import { apiClient } from '@api/httpClients';

export const useProfileStore = defineStore('profile', () => {
  const userStore = useUserStore();

  // ==================================================
  // STATE
  // ==================================================

  const loadingProfile = ref(false);

  const showProfileModal = ref(false);
  const showPasswordModal = ref(false);
  const showPinModal = ref(false);

  // ==================================================
  // FORMS
  // ==================================================

  const profileForm = reactive({
    photoUrl: '',
    loading: false,
  });

  const passwordForm = reactive({
    password: '',
    confirmPassword: '',
    loading: false,
  });

  const pinForm = reactive({
    pin: '',
    confirmPin: '',
    loading: false,
  });

  // ==================================================
  // COMPUTED
  // ==================================================

  const user = computed(() => userStore.user || {});

  const formattedAddress = computed(() => {
    const address = user.value?.address;

    if (!address) return 'No address available';

    return [address.street, address.city, address.state, address.country, address.zipCode]
      .filter(Boolean)
      .join(', ');
  });

  // ==================================================
  // MODALS
  // ==================================================

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

  // ==================================================
  // RESET FORMS
  // ==================================================

  const resetProfileForm = () => {
    profileForm.photoUrl = '';
  };

  const resetPasswordForm = () => {
    passwordForm.password = '';
    passwordForm.confirmPassword = '';
  };

  const resetPinForm = () => {
    pinForm.pin = '';
    pinForm.confirmPin = '';
  };

  // ==================================================
  // FETCH PROFILE
  // ==================================================

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

  // ==================================================
  // UPDATE PROFILE PHOTO
  // ==================================================

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

  // ==================================================
  // UPDATE PASSWORD
  // ==================================================

  const updatePassword = async (payload = null) => {
    const form = payload || passwordForm;
    const password = form.password || '';
    const confirmPassword = form.confirmPassword || '';

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      passwordForm.loading = true;

      const response = await apiClient.put('/auth/update-password', {
        password,
      });

      toast.success(response?.data?.message || 'Password updated successfully');

      resetPasswordForm();
      closePasswordModal();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update password');
    } finally {
      passwordForm.loading = false;
    }
  };

  // ==================================================
  // UPDATE PIN
  // ==================================================

  const updatePin = async (payload = null) => {
    const form = payload || pinForm;
    const pin = form.pin || '';
    const confirmPin = form.confirmPin || '';

    if (!/^\d{4}$/.test(pin)) {
      toast.error('PIN must be exactly 4 digits');
      return;
    }

    if (pin !== confirmPin) {
      toast.error('PINs do not match');
      return;
    }

    try {
      pinForm.loading = true;

      const response = await apiClient.put('/auth/update-pin', {
        pin,
      });

      userStore.updateUser({
        isPinSet: true,
      });

      toast.success(response?.data?.message || 'PIN updated successfully');

      resetPinForm();
      closePinModal();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update PIN');
    } finally {
      pinForm.loading = false;
    }
  };

  return {
    // state
    loadingProfile,
    showProfileModal,
    showPasswordModal,
    showPinModal,

    // forms
    profileForm,
    passwordForm,
    pinForm,

    // computed
    user,
    formattedAddress,

    // modal actions
    openProfileModal,
    closeProfileModal,
    openPasswordModal,
    closePasswordModal,
    openPinModal,
    closePinModal,

    // actions
    fetchCurrentProfile,
    updateProfile,
    updatePassword,
    updatePin,
  };
});

export default useProfileStore;

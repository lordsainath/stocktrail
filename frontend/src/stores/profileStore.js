// Imports

import { defineStore } from 'pinia';
import { computed, reactive, ref } from 'vue';
import { toast } from 'vue-sonner';

import useUserStore from '@stores/userStore';
import { apiClient } from '@api/httpClients';
import { passwordSchema, pinSchema } from '@composables/useValidationSchemas';

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
    errors: {},
  });

  const pinForm = reactive({
    pin: '',
    confirmPin: '',
    loading: false,
    errors: {},
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
    passwordForm.password = '';
    passwordForm.confirmPassword = '';
    passwordForm.errors = {};
    showPasswordModal.value = true;
  };

  const closePasswordModal = () => {
    showPasswordModal.value = false;
  };

  const openPinModal = () => {
    pinForm.pin = '';
    pinForm.confirmPin = '';
    pinForm.errors = {};
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
    passwordForm.errors = {};
  };
  const resetPinForm = () => {
    pinForm.pin = '';
    pinForm.confirmPin = '';
    pinForm.errors = {};
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

    // Keep store-backed form in sync for validation errors display
    passwordForm.password = form.password || '';
    passwordForm.confirmPassword = form.confirmPassword || '';
    // Clear previous errors
    passwordForm.errors = {};

    try {
      await passwordSchema.validate(form, {
        abortEarly: false,
      });
    } catch (error) {
      if (error.name === 'ValidationError') {
        error.inner.forEach((err) => {
          if (err.path) {
            passwordForm.errors[err.path] = err.message;
          }
        });

        return;
      }

      return;
    }

    passwordForm.loading = true;

    try {
      const response = await apiClient.put('/auth/update-password', {
        password: passwordForm.password,
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

    // Keep store-backed pin values in sync for validation errors display
    pinForm.pin = form.pin || '';
    pinForm.confirmPin = form.confirmPin || '';

    // Clear previous errors reactively
    Object.keys(pinForm.errors).forEach((k) => delete pinForm.errors[k]);

    try {
      await pinSchema.validate(form, {
        abortEarly: false,
      });
    } catch (error) {
      if (error.name === 'ValidationError') {
        // Populate errors reactively
        error.inner.forEach((err) => {
          pinForm.errors[err.path] = err.message;
        });
        toast.error(error.inner[0]?.message || 'Validation failed');
        return;
      }

      toast.error(error?.message || 'Validation failed');
      return;
    }

    pinForm.loading = true;

    try {
      const response = await apiClient.put('/auth/update-pin', {
        pin: pinForm.pin,
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

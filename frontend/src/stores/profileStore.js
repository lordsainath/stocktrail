import { defineStore } from 'pinia';
import { computed, reactive, ref } from 'vue';
import { toast } from 'vue-sonner';

import useUserStore from '@stores/userStore';
import { apiClient } from '@api/httpClients';

import useEditSchemaValidator from '@/composables/editprofile-schema-validator';
import useProfilePasswordSchemaValidator from '@/composables/profilepassword-schema-validator';
import useProfilePinSchemaValidator from '@/composables/profilepin-schema-validator';

import { useForm } from 'vee-validate';

export const useProfileStore = defineStore('profile', () => {
  const userStore = useUserStore();

  const loadingProfile = ref(false);

  const showProfileModal = ref(false);
  const showPasswordModal = ref(false);
  const showPinModal = ref(false);

  const { editProfileSchema } = useEditSchemaValidator();
  const { editPasswordSchema } = useProfilePasswordSchemaValidator();
  const { editPinSchema } = useProfilePinSchemaValidator();

  /*
   |--------------------------------------------------------------------------
   | Profile Form
   |--------------------------------------------------------------------------
   */
  const {
    errors: defineProfileError,
    defineField: defineProfileField,
    handleSubmit: handleProfileSubmit,
    resetForm: resetProfileForm,
    setValues: setProfileValues,
  } = useForm({
    validationSchema: editProfileSchema,
  });

  /*
   |--------------------------------------------------------------------------
   | Password Form
   |--------------------------------------------------------------------------
   */
  const {
    errors: definePasswordError,
    defineField: definePasswordField,
    handleSubmit: handlePasswordSubmit,
    resetForm: resetPasswordForm,
  } = useForm({
    validationSchema: editPasswordSchema,
  });

  /*
   |--------------------------------------------------------------------------
   | Pin Form
   |--------------------------------------------------------------------------
   */
  const {
    errors: definePinError,
    defineField: definePinField,
    handleSubmit: handlePinSubmit,
    resetForm: resetPinForm,
  } = useForm({
    validationSchema: editPinSchema,
  });

  /*
   |--------------------------------------------------------------------------
   | Fields
   |--------------------------------------------------------------------------
   */
  const [photoUrl] = defineProfileField('photoUrl');
  const [password] = definePasswordField('password');
  const [confirmPassword] = definePasswordField('confirmPassword');
  const [pin] = definePinField('pin');
  const [confirmPin] = definePinField('confirmPin');

  /*
   |--------------------------------------------------------------------------
   | Loading States
   |--------------------------------------------------------------------------
   */
  const profileForm = reactive({
    loading: false,
  });

  const passwordForm = reactive({
    loading: false,
  });

  const pinForm = reactive({
    loading: false,
  });

  /*
   |--------------------------------------------------------------------------
   | Computed
   |--------------------------------------------------------------------------
   */
  const user = computed(() => userStore.user || {});

  const formattedAddress = computed(() => {
    const address = user.value?.address;

    if (!address) return 'No address available';

    return [
      address.street,
      address.city,
      address.state,
      address.country,
      address.zipCode,
    ]
      .filter(Boolean)
      .join(', ');
  });

  /*
   |--------------------------------------------------------------------------
   | Modal Controls
   |--------------------------------------------------------------------------
   */
  const openProfileModal = () => {
    setProfileValues({
      photoUrl: user.value?.photoUrl || '',
    });

    showProfileModal.value = true;
  };

  const closeProfileModal = () => {
    resetProfileForm();
    showProfileModal.value = false;
  };

  const openPasswordModal = () => {
    resetPasswordForm();
    showPasswordModal.value = true;
  };

  const closePasswordModal = () => {
    resetPasswordForm();
    showPasswordModal.value = false;
  };

  const openPinModal = () => {
    resetPinForm();
    showPinModal.value = true;
  };

  const closePinModal = () => {
    resetPinForm();
    showPinModal.value = false;
  };

  /*
   |--------------------------------------------------------------------------
   | API
   |--------------------------------------------------------------------------
   */
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

  /*
   |--------------------------------------------------------------------------
   | Update Profile
   |--------------------------------------------------------------------------
   */
  const updateProfile = handleProfileSubmit(async (values) => {
    try {
      profileForm.loading = true;

      const response = await apiClient.put('/auth/update-photo', {
        photoUrl: values.photoUrl,
      });

      if (response?.data?.data) {
        userStore.updateUser(response.data.data);
      }

      toast.success(response?.data?.message || 'Profile updated successfully');

      closeProfileModal();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update profile');
    } finally {
      profileForm.loading = false;
    }
  });

  /*
   |--------------------------------------------------------------------------
   | Update Password
   |--------------------------------------------------------------------------
   */
  const updatePassword = handlePasswordSubmit(async (values) => {
    try {
      passwordForm.loading = true;

      const response = await apiClient.put('/auth/update-password', {
        password: values.password,
      });

      toast.success(response?.data?.message || 'Password updated successfully');

      closePasswordModal();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update password');
    } finally {
      passwordForm.loading = false;
    }
  });

  /*
   |--------------------------------------------------------------------------
   | Update PIN
   |--------------------------------------------------------------------------
   */
  const updatePin = handlePinSubmit(async (values) => {
    try {
      pinForm.loading = true;

      const response = await apiClient.put('/auth/update-pin', {
        pin: values.pin,
      });

      userStore.updateUser({
        isPinSet: true,
      });

      toast.success(response?.data?.message || 'PIN updated successfully');

      closePinModal();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update PIN');
    } finally {
      pinForm.loading = false;
    }
  });

  return {
    photoUrl,
    password,
    confirmPassword,
    pin,
    confirmPin,

    defineProfileError,
    definePasswordError,
    definePinError,

    loadingProfile,
    profileForm,
    passwordForm,
    pinForm,

    showProfileModal,
    showPasswordModal,
    showPinModal,

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
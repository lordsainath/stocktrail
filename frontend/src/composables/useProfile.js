import { computed, reactive, ref } from 'vue';
import { toast } from 'vue-sonner';
import useUserStore from '../stores/userStore';
import { fetchCurrentProfile, updatePassword as updatePasswordRequest, updatePin as updatePinRequest, updateProfilePhoto as updateProfilePhotoRequest } from '../services/profile.service';
import { getErrorMessage } from '../utils/error';
import { formatAddress } from '../utils/profile';

export function useProfile() {
    const userStore = useUserStore();

    const showProfileModal = ref(false);
    const showPasswordModal = ref(false);
    const showPinModal = ref(false);
    const loadingProfile = ref(false);

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

    const user = computed(() => userStore.user || {});
    const formattedAddress = computed(() => formatAddress(user.value?.address));

    const openProfileModal = () => {
        profileForm.photoUrl = user.value?.photoUrl || '';
        showProfileModal.value = true;
    };

    const openPasswordModal = () => {
        showPasswordModal.value = true;
    };

    const openPinModal = () => {
        showPinModal.value = true;
    };

    const closeProfileModal = () => {
        showProfileModal.value = false;
    };

    const closePasswordModal = () => {
        showPasswordModal.value = false;
    };

    const closePinModal = () => {
        showPinModal.value = false;
    };

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

    const fetchProfile = async () => {
        try {
            loadingProfile.value = true;
            const response = await fetchCurrentProfile();

            if (response?.data) {
                userStore.updateUser(response.data);
            }
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            loadingProfile.value = false;
        }
    };

    const updateProfile = async () => {
        const photoUrl = profileForm.photoUrl.trim();

        if (!photoUrl) {
            toast.error('Profile image URL is required');
            return;
        }

        try {
            profileForm.loading = true;
            const response = await updateProfilePhotoRequest(photoUrl);

            if (response?.data) {
                userStore.updateUser(response.data);
            } else {
                userStore.updateUser({ photoUrl });
            }

            resetProfileForm();
            closeProfileModal();
            toast.success(response?.message || 'Profile updated successfully');
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            profileForm.loading = false;
        }
    };

    const updatePassword = async () => {
        if (passwordForm.password.length < 8) {
            toast.error('Password must be at least 8 characters');
            return;
        }

        if (passwordForm.password !== passwordForm.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        try {
            passwordForm.loading = true;
            const response = await updatePasswordRequest(passwordForm.password);

            resetPasswordForm();
            closePasswordModal();
            toast.success(response?.message || 'Password updated successfully');
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            passwordForm.loading = false;
        }
    };

    const updatePin = async () => {
        if (!/^\d{4}$/.test(pinForm.pin)) {
            toast.error('PIN must be exactly 4 digits');
            return;
        }

        if (pinForm.pin !== pinForm.confirmPin) {
            toast.error('PINs do not match');
            return;
        }

        try {
            pinForm.loading = true;
            const response = await updatePinRequest(pinForm.pin);

            resetPinForm();
            userStore.updateUser({ isPinSet: true });
            closePinModal();
            toast.success(response?.message || 'PIN updated successfully');
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            pinForm.loading = false;
        }
    };

    return {
        user,
        formattedAddress,
        showProfileModal,
        showPasswordModal,
        showPinModal,
        loadingProfile,
        profileForm,
        passwordForm,
        pinForm,
        openProfileModal,
        openPasswordModal,
        openPinModal,
        closeProfileModal,
        closePasswordModal,
        closePinModal,
        fetchProfile,
        updateProfile,
        updatePassword,
        updatePin,
    };
}

export default useProfile;
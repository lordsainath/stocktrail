import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue-sonner';
import { login as loginRequest, verifyLoginPin } from '../services/auth.service';
import useUserStore from '../stores/userStore';
import { getErrorMessage } from '../utils/error';

export function useLogin() {
  const router = useRouter();
  const userStore = useUserStore();

  const email = ref('');
  const password = ref('');
  const pin = ref('');
  const loading = ref(false);
  const step = ref('credentials');
  const tempToken = ref(userStore.tempToken || '');

  const handleCredentials = async () => {
    if (!email.value || !password.value) {
      toast.error('Email and password are required');
      return;
    }

    loading.value = true;
    try {
      const response = await loginRequest(email.value, password.value);
      const temp = response?.data?.tempToken || response?.tempToken || response?.data?.data?.tempToken || '';
      tempToken.value = temp;
      userStore.setTempToken(tempToken.value);
      step.value = 'pin';
      toast.success('Password verified. Enter your PIN to continue.');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Login failed'));
    } finally {
      loading.value = false;
    }
  };

  const handlePin = async () => {
    if (!pin.value) {
      toast.error('PIN is required');
      return;
    }

    loading.value = true;
    try {
      const response = await verifyLoginPin(tempToken.value, pin.value);
      const sessionPayload = response?.data?.data || response?.data || response || null;
      userStore.setSession(sessionPayload);
      userStore.setTempToken('');
      toast.success('Login successful');
      router.push('/');
    } catch (error) {
      toast.error(getErrorMessage(error, 'PIN verification failed'));
    } finally {
      loading.value = false;
    }
  };

  const backToCredentials = () => {
    step.value = 'credentials';
    userStore.setTempToken('');
  };

  return {
    email,
    password,
    pin,
    loading,
    step,
    tempToken,
    handleCredentials,
    handlePin,
    backToCredentials,
  };
}

export default useLogin;
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue-sonner';
import { useForm } from 'vee-validate';
import useAuthStore from '@stores/authStore';
import { getErrorMessage } from '@composables/useErrorMessage';
import { loginCredentialsSchema, loginPinSchema } from '@composables/useValidationSchemas';

export function useLogin() {
  const router = useRouter();
  const authStore = useAuthStore();

  const step = computed(() => authStore.step);

  const validationSchema = computed(() => {
    if (step.value === 'credentials') {
      return loginCredentialsSchema;
    }

    return loginPinSchema;
  });

  const { errors, defineField, validate, setFieldValue, setFieldError } = useForm({
    validationSchema,
    initialValues: {
      email: '',
      password: '',
      pin: '',
    },
  });

  const [email] = defineField('email');
  const [password] = defineField('password');
  const [pin] = defineField('pin');

  const loading = computed(() => authStore.loading);
  const tempToken = computed(() => authStore.tempToken);

  const handleCredentials = async () => {
    step.value = 'credentials';
    const { valid, errors: validationErrors } = await validate();

    if (!valid) {
      const firstKey = Object.keys(validationErrors || {})[0];
      return { success: false, firstError: firstKey };
    }

    loading.value = true;
    try {
      const res = await authStore.startLogin({
        email: email.value,
        password: password.value,
      });

      if (!res || !res.success) {
        throw res?.error || new Error('Login failed');
      }

      toast.success('Password verified. Enter your PIN to continue.');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Login failed'));
      return { success: false };
    } finally {
      loading.value = false;
    }
    return { success: true };
  };

  const resetPin = () => {
    setFieldValue('pin', '');
  };

  const handlePin = async () => {
    step.value = 'pin';
    const { valid, errors: validationErrors } = await validate();

    if (!valid) {
      const firstKey = Object.keys(validationErrors || {})[0];
      return { success: false, firstError: firstKey };
    }

    loading.value = true;
    try {
      const res = await authStore.verifyPin(pin.value);
      if (!res || !res.success) {
        throw res?.error || new Error('PIN verification failed');
      }

      toast.success('Login successful');
      router.push('/');
    } catch (error) {
      resetPin();
      setFieldError('pin', getErrorMessage(error, 'PIN verification failed'));
      toast.error(getErrorMessage(error, 'PIN verification failed'));
      return { success: false };
    } finally {
      loading.value = false;
    }
    return { success: true };
  };

  const backToCredentials = () => {
    step.value = 'credentials';
    authStore.backToCredentials();
  };

  return {
    email,
    password,
    pin,
    loading,
    step,
    tempToken,
    errors,
    handleCredentials,
    handlePin,
    backToCredentials,
    resetPin,
  };
}

export default useLogin;

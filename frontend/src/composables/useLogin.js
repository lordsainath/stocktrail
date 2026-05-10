import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue-sonner';
import { useForm } from 'vee-validate';
import useUserStore from '@stores/userStore';
import useAuthStore from '@stores/authStore';
import { getErrorMessage } from '@composables/useErrorMessage';
import { loginCredentialsSchema, loginPinSchema } from '@composables/useValidationSchemas';

export function useLogin() {
  const router = useRouter();
  const userStore = useUserStore();
  const authStore = useAuthStore();

  const step = ref('credentials');

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

  const loading = ref(false);
  const tempToken = ref(userStore.tempToken || '');

  const handleCredentials = async () => {
    step.value = 'credentials';
    const { valid, errors: validationErrors } = await validate();

    if (!valid) {
      const firstKey = Object.keys(validationErrors || {})[0];
      return { success: false, firstError: firstKey };
    }

    loading.value = true;
    try {
      const response = await authStore.login({
        email: email.value,
        password: password.value,
      });
      const temp =
        response?.data?.tempToken || response?.tempToken || response?.data?.data?.tempToken || '';
      tempToken.value = temp;
      userStore.setTempToken(tempToken.value);
      step.value = 'pin';
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
      const response = await authStore.verifyLoginPin({
        tempToken: tempToken.value,
        pin: pin.value,
      });
      const sessionPayload = response?.data?.data || response?.data || response || null;
      userStore.setSession(sessionPayload);
      userStore.setTempToken('');
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
    userStore.setTempToken('');
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

import { computed } from 'vue';
import * as yup from 'yup';

export default function useProfileSchemaValidator() {
  const passwordSchemaValidator = () => {
    return yup.object({
      password: yup
        .string()
        .min(8, 'Password must be at least 8 characters')
        .max(100, 'Password cannot exceed 100 characters')
        .required('Password is required'),

      confirmPassword: yup
        .string()
        .oneOf([yup.ref('password')], 'Passwords do not match')
        .required('Confirm password is required'),
    });
  };

  const passwordSchema = computed(() => {
    return passwordSchemaValidator();
  });

  return {
    passwordSchema,
  };
}

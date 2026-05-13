import { computed } from 'vue';
import * as yup from 'yup';

export default function useProfilePinSchemaValidator() {
    const editPinSchema = computed(() =>
        yup.object({
            pin: yup
                .string()
                .length(4, 'PIN must be exactly 4 digits')
                .matches(/^\d+$/, 'PIN must contain only numbers')
                .required('PIN is required'),

            confirmPin: yup
                .string()
                .oneOf([yup.ref('pin'), null], 'PINs do not match')
                .required('Confirm PIN is required'),
        })
    );

    return {
        editPinSchema,
    };
}
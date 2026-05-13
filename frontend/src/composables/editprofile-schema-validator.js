import { computed } from 'vue';
import * as yup from 'yup';

export default function useEditSchemaValidator() {
    const editProfileSchemaValidator = () => {
        return yup.object({
            photoUrl: yup.string().required().label('Photo URL'),
        });
    };

    const editProfileSchema = computed(() => {
        return editProfileSchemaValidator();
    });

    return {
        editProfileSchema,
    };
}

<script setup>
import { nextTick, ref } from 'vue';
import { useForm } from 'vee-validate';

import { passwordSchema } from '@composables/useValidationSchemas';
import { useProfileStore } from '@stores/profileStore';

import BaseModal from '@components/base/BaseModal.vue';
import BaseButton from '@components/base/BaseButton.vue';
import BaseInput from '@components/base/BaseInput.vue';

const profileStore = useProfileStore();

const show = defineModel('show');

const passwordRef = ref(null);
const confirmPasswordRef = ref(null);

const {
  errors,
  defineField,
  handleSubmit,
  resetForm,
} = useForm({
  validationSchema: passwordSchema,
});

const [password] = defineField('password');
const [confirmPassword] = defineField('confirmPassword');

const closeModal = () => {
  resetForm();
  show.value = false;
};

const onSubmit = handleSubmit(
  async (values) => {
    const isSuccess = await profileStore.updatePassword(values);

    if (isSuccess) {
      resetForm();
    }
  },

  async () => {
    await nextTick();

    if (errors.value.password) {
      passwordRef.value?.focus();
      return;
    }

    if (errors.value.confirmPassword) {
      confirmPasswordRef.value?.focus();
    }
  }
);
</script>

<template>
  <BaseModal :show="show" @close="closeModal">
    <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100">
      Change Password
    </h3>

    <div class="mt-4">
      <BaseInput
        ref="passwordRef"
        v-model="password"
        type="password"
        placeholder="New password"
        :error="errors.password"
      />
    </div>

    <div class="mt-3">
      <BaseInput
        ref="confirmPasswordRef"
        v-model="confirmPassword"
        type="password"
        placeholder="Confirm password"
        :error="errors.confirmPassword"
      />
    </div>

    <div class="mt-4 flex justify-end gap-2">
      <BaseButton
        variant="secondary"
        :full-width="false"
        @click="closeModal"
      >
        Cancel
      </BaseButton>

      <BaseButton
        :disabled="profileStore.passwordForm.loading"
        variant="primary"
        :full-width="false"
        @click="onSubmit"
      >
        {{
          profileStore.passwordForm.loading
            ? 'Saving...'
            : 'Save'
        }}
      </BaseButton>
    </div>
  </BaseModal>
</template>
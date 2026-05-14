<script setup>
import { nextTick, ref } from 'vue';
import { useForm } from 'vee-validate';

import { useProfileStore } from '@stores/profileStore';

import BaseModal from '@components/base/BaseModal.vue';
import BaseButton from '@components/base/BaseButton.vue';
import BaseInput from '@components/base/BaseInput.vue';
import { storeToRefs } from 'pinia';

const profileStore = useProfileStore();

const show = defineModel('show');

const passwordRef = ref(null);
const confirmPasswordRef = ref(null);

const { password, confirmPassword, definePasswordError } = storeToRefs(profileStore);
const closeModal = () => {
  show.value = false;
};
</script>

<template>
  <BaseModal :show="show" @close="closeModal">
    <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100">
      Change Password
    </h3>

    <div class="mt-4">
      <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
        New Password
      </label>

      <BaseInput
        :ref="passwordRef"
        v-model="password"
        type="password"
        placeholder="Enter new password"
        :error="definePasswordError.password"
      />
    </div>

    <div class="mt-4">
      <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
        Confirm Password
      </label>

      <BaseInput
        :ref="confirmPasswordRef"
        v-model="confirmPassword"
        type="password"
        placeholder="Confirm new password"
        :error="definePasswordError.confirmPassword"
      />
    </div>

    <div class="mt-5 flex justify-end gap-2">
      <BaseButton
        variant="secondary"
        :full-width="false"
        :disabled="profileStore.passwordForm.loading"
        @click="profileStore.closePasswordModal"
      >
        Cancel
      </BaseButton>

      <BaseButton
        variant="primary"
        :full-width="false"
        :disabled="profileStore.passwordForm.loading"
        @click="profileStore.updatePassword"
      >
        {{ profileStore.passwordForm.loading ? 'Saving...' : 'Save' }}
      </BaseButton>
    </div>
  </BaseModal>
</template>

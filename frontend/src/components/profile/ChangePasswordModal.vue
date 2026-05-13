<script setup>
import { ref, watch, nextTick } from 'vue';

import BaseModal from '@components/base/BaseModal.vue';
import BaseButton from '@components/base/BaseButton.vue';
import BaseInput from '@components/base/BaseInput.vue';

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },

  form: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['close', 'save']);

const passwordRef = ref(null);
const confirmPasswordRef = ref(null);

const passwordValue = ref(props.form.password || '');
const confirmPasswordValue = ref(props.form.confirmPassword || '');

watch(
  () => props.show,
  (isOpen) => {
    if (!isOpen) return;
    passwordValue.value = props.form.password || '';
    confirmPasswordValue.value = props.form.confirmPassword || '';
  },
  { immediate: true }
);

// Focus first invalid field
watch(
  () => props.form.errors,
  async (errors) => {
    await nextTick();

    if (errors?.password) {
      passwordRef.value?.focus();
      return;
    }

    if (errors?.confirmPassword) {
      confirmPasswordRef.value?.focus();
    }
  },
  {
    deep: true,
  }
);
</script>

<template>
  <BaseModal :show="show" @close="emit('close')">
    <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100">Change Password</h3>

    <!-- PASSWORD -->
    <div class="mt-4">
      <BaseInput
        ref="passwordRef"
        v-model="passwordValue"
        type="password"
        placeholder="New password"
        :error="props.form.errors?.password"
      />
    </div>

    <!-- CONFIRM PASSWORD -->
    <div class="mt-3">
      <BaseInput
        ref="confirmPasswordRef"
        v-model="confirmPasswordValue"
        type="password"
        placeholder="Confirm password"
        :error="props.form.errors?.confirmPassword"
      />
    </div>

    <!-- ACTIONS -->
    <div class="mt-4 flex justify-end gap-2">
      <BaseButton variant="secondary" :full-width="false" @click="emit('close')">
        Cancel
      </BaseButton>

      <BaseButton
        :disabled="props.form.loading"
        variant="primary"
        :full-width="false"
        @click="emit('save', { password: passwordValue, confirmPassword: confirmPasswordValue })"
      >
        {{ props.form.loading ? 'Saving...' : 'Save' }}
      </BaseButton>
    </div>
  </BaseModal>
</template>

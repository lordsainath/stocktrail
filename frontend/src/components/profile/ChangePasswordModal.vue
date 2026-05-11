<script setup>
import { reactive, watch } from 'vue';

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
    default: () => ({
      password: '',
      confirmPassword: '',
      loading: false,
    }),
  },
});

const emit = defineEmits(['close', 'save', 'update:form']);

const localForm = reactive({
  password: '',
  confirmPassword: '',
  loading: false,
});

watch(
  () => props.form,
  (newForm) => {
    Object.assign(localForm, newForm);
  },
  { immediate: true, deep: true }
);

watch(
  localForm,
  (value) => {
    emit('update:form', { ...value });
  },
  { deep: true }
);
</script>

<template>
  <BaseModal :show="show" @close="emit('close')">
    <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100">Change Password</h3>

    <div class="mt-4">
      <BaseInput v-model="localForm.password" type="password" placeholder="New password" />
    </div>

    <div class="mt-3">
      <BaseInput
        v-model="localForm.confirmPassword"
        type="password"
        placeholder="Confirm password"
      />
    </div>

    <div class="mt-4 flex justify-end gap-2">
      <BaseButton variant="secondary" :full-width="false" @click="emit('close')">
        Cancel
      </BaseButton>

      <BaseButton
        :disabled="localForm.loading"
        variant="primary"
        :full-width="false"
        @click="emit('save')"
      >
        {{ localForm.loading ? 'Saving...' : 'Save' }}
      </BaseButton>
    </div>
  </BaseModal>
</template>

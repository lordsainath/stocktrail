<script setup>
import { reactive, watch } from 'vue';
import VOtpInput from 'vue3-otp-input';

import BaseModal from '@components/base/BaseModal.vue';
import BaseButton from '@components/base/BaseButton.vue';

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },

  form: {
    type: Object,
    default: () => ({
      pin: '',
      confirmPin: '',
      loading: false,
    }),
  },
});

const emit = defineEmits(['close', 'save', 'update:form']);

const localForm = reactive({
  pin: '',
  confirmPin: '',
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
    <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100">Change PIN</h3>

    <p class="mt-4 text-sm text-slate-500 dark:text-slate-400">Enter new PIN</p>

    <div class="mt-2 flex justify-center">
      <VOtpInput
        v-model:value="localForm.pin"
        :num-inputs="4"
        input-type="number"
        separator=""
        input-classes="
          w-12 h-12 mx-1 text-center text-base font-semibold
          border border-slate-300 dark:border-slate-600
          rounded-lg bg-white dark:bg-slate-800
          text-slate-900 dark:text-slate-100
          focus:outline-none focus:ring-2 focus:ring-emerald-500
        "
      />
    </div>

    <p class="mt-4 text-sm text-slate-500 dark:text-slate-400">Confirm new PIN</p>

    <div class="mt-2 flex justify-center">
      <VOtpInput
        v-model:value="localForm.confirmPin"
        :num-inputs="4"
        input-type="number"
        separator=""
        input-classes="
          w-12 h-12 mx-1 text-center text-base font-semibold
          border border-slate-300 dark:border-slate-600
          rounded-lg bg-white dark:bg-slate-800
          text-slate-900 dark:text-slate-100
          focus:outline-none focus:ring-2 focus:ring-emerald-500
        "
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

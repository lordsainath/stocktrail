<script setup>
import { computed, ref, watch } from 'vue';
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
      errors: {},
    }),
  },
});

const emit = defineEmits(['close', 'save']);

const pinValue = ref(props.form.pin || '');
const confirmPinValue = ref(props.form.confirmPin || '');

watch(
  () => props.show,
  (isOpen) => {
    if (!isOpen) return;
    pinValue.value = props.form.pin || '';
    confirmPinValue.value = props.form.confirmPin || '';
  },
  { immediate: true }
);

const pinInputClasses = computed(() => {
  const base =
    'w-12 h-12 mr-2 text-center text-base font-semibold rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1';
  return props.form.errors?.pin
    ? `${base} border border-red-500 focus:ring-red-400`
    : `${base} border border-slate-300 dark:border-slate-600 focus:ring-primary`;
});

const confirmPinInputClasses = computed(() => {
  const base =
    'w-12 h-12 mr-2 text-center text-base font-semibold rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1';
  return props.form.errors?.confirmPin
    ? `${base} border border-red-500 focus:ring-red-400`
    : `${base} border border-slate-300 dark:border-slate-600 focus:ring-primary`;
});
</script>

<template>
  <BaseModal :show="show" @close="emit('close')">
    <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100">Change PIN</h3>

    <div class="mt-4">
      <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
        New PIN
      </label>

      <div>
        <VOtpInput
          v-model:value="pinValue"
          :num-inputs="4"
          input-type="number"
          separator=""
          :input-classes="pinInputClasses"
        />

        <p v-if="props.form.errors?.pin" class="mt-2 text-sm text-red-500">
          {{ props.form.errors.pin }}
        </p>
      </div>
    </div>

    <div class="mt-4">
      <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
        Confirm PIN
      </label>

      <div>
        <VOtpInput
          v-model:value="confirmPinValue"
          :num-inputs="4"
          input-type="number"
          separator=""
          :input-classes="confirmPinInputClasses"
        />

        <p v-if="props.form.errors?.confirmPin" class="mt-2 text-sm text-red-500">
          {{ props.form.errors.confirmPin }}
        </p>
      </div>
    </div>

    <div class="mt-6 flex justify-end gap-2">
      <BaseButton variant="secondary" :full-width="false" @click="emit('close')">
        Cancel
      </BaseButton>

      <BaseButton
        :disabled="props.form.loading"
        variant="primary"
        :full-width="false"
        @click="emit('save', { pin: pinValue, confirmPin: confirmPinValue })"
      >
        {{ props.form.loading ? 'Saving...' : 'Save' }}
      </BaseButton>
    </div>
  </BaseModal>
</template>

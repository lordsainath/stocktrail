<script setup>
import { computed, nextTick, ref } from 'vue';

import VOtpInput from 'vue3-otp-input';

import { useProfileStore } from '@stores/profileStore';

import BaseModal from '@components/base/BaseModal.vue';
import BaseButton from '@components/base/BaseButton.vue';
import { storeToRefs } from 'pinia';

const profileStore = useProfileStore();

const show = defineModel('show');

const pinOtpRef = ref(null);
const confirmOtpRef = ref(null);

const { pin, confirmPin, definePinError } = storeToRefs(profileStore);

const closeModal = () => {
  show.value = false;
};

const pinInputClasses = computed(() => {
  const base =
    'w-12 h-12 mr-2 text-center text-base font-semibold rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1';

  return definePinError.value.pin
    ? `${base} border border-red-500 focus:ring-red-400`
    : `${base} border border-slate-300 dark:border-slate-600 focus:ring-primary`;
});

const confirmPinInputClasses = computed(() => {
  const base =
    'w-12 h-12 mr-2 text-center text-base font-semibold rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1';

  return definePinError.value.confirmPin
    ? `${base} border border-red-500 focus:ring-red-400`
    : `${base} border border-slate-300 dark:border-slate-600 focus:ring-primary`;
});
</script>

<template>
  <BaseModal :show="show" @close="closeModal">
    <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100">Change PIN</h3>

    <div class="mt-4">
      <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
        New PIN
      </label>

      <VOtpInput
        :ref="pinOtpRef"
        v-model:value="pin"
        :num-inputs="4"
        input-type="number"
        separator=""
        :input-classes="pinInputClasses"
      />

      <p v-if="definePinError.pin" class="mt-2 text-sm text-red-500">
        {{ definePinError.pin }}
      </p>
    </div>

    <div class="mt-4">
      <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
        Confirm PIN
      </label>

      <VOtpInput
        :ref="confirmOtpRef"
        v-model:value="confirmPin"
        :num-inputs="4"
        input-type="number"
        separator=""
        :input-classes="confirmPinInputClasses"
      />

      <p v-if="definePinError.confirmPin" class="mt-2 text-sm text-red-500">
        {{ definePinError.confirmPin }}
      </p>
    </div>

    <div class="mt-6 flex justify-end gap-2">
      <BaseButton
        variant="secondary"
        :full-width="false"
        :disabled="profileStore.pinForm.loading"
        @click="profileStore.closePinModal"
      >
        Cancel
      </BaseButton>

      <BaseButton
        variant="primary"
        :full-width="false"
        :disabled="profileStore.pinForm.loading"
        @click="profileStore.updatePin"
      >
        {{ profileStore.pinForm.loading ? 'Saving...' : 'Save' }}
      </BaseButton>
    </div>
  </BaseModal>
</template>

<script setup>
import { ref, watch, nextTick, onUnmounted } from 'vue';
import { toast } from 'vue-sonner';
import { useRouter } from 'vue-router';
import { useForm } from 'vee-validate';

import useRegisterStore from '@stores/registerStore';

import BaseOtpInput from '@components/base/BaseOtpInput.vue';
import BaseButton from '@components/base/BaseButton.vue';

import { registerPinSchema } from '@composables/useValidationSchemas';

const router = useRouter();

const registerStore = useRegisterStore();

/*
  formData is already reactive
  no need for storeToRefs
*/
const { formData, setPinCode } = registerStore;

const loading = ref(false);

const { errors, handleSubmit, defineField, setFieldValue } = useForm({
  validationSchema: registerPinSchema,

  initialValues: {
    pin: formData.pin || '',
    confirmPin: formData.confirmPin || '',
  },
});

const [pin] = defineField('pin');
const [confirmPin] = defineField('confirmPin');

watch(pin, (value) => {
  formData.pin = value || '';
});

watch(confirmPin, (value) => {
  formData.confirmPin = value || '';
});

const handleBack = () => router.back();

const handleFinish = handleSubmit(
  async (values) => {
    loading.value = true;

    try {
      formData.pin = values.pin || '';
      formData.confirmPin = values.confirmPin || '';
      await setPinCode(values.pin);

      toast.success('PIN set successfully. Please login to continue.');

      router.push('/auth/login');
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || 'Failed to set PIN';

      toast.error(message);
    } finally {
      loading.value = false;
    }
  },

  async () => {
    const firstKey = Object.keys(errors.value || {})[0];

    await nextTick();

    if (firstKey === 'pin') {
      document.querySelector('#pin-inputs input')?.focus();
    } else if (firstKey === 'confirmPin') {
      document.querySelector('#confirm-pin-inputs input')?.focus();
    }
  }
);

const handlePinEnter = async () => {
  await nextTick();

  document.querySelector('#confirm-pin-inputs input')?.focus();
};

const handleConfirmPinEnter = () => {
  handleFinish();
};

onUnmounted(() => {
  setFieldValue('pin', '');
  setFieldValue('confirmPin', '');

  formData.pin = '';
  formData.confirmPin = '';
});
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center flex-col gap-4">
      <div id="pin-inputs" class="w-full">
        <label class="text-sm font-medium text-slate-700 dark:text-slate-200 mb-3 block"
          >Set a 4-digit PIN</label
        >
        <BaseOtpInput
          v-model="pin"
          :num-inputs="4"
          input-type="number"
          :should-auto-focus="true"
          :is-input-num="true"
          @keyup.enter="handlePinEnter"
        />
        <p v-if="errors.pin" class="mt-2 text-sm text-red-500">
          {{ errors.pin }}
        </p>
      </div>

      <div id="confirm-pin-inputs" class="w-full">
        <label class="text-sm font-medium text-slate-700 dark:text-slate-200 mb-3 block"
          >Confirm PIN</label
        >
        <BaseOtpInput
          v-model="confirmPin"
          :num-inputs="4"
          input-type="number"
          :should-auto-focus="false"
          :is-input-num="true"
          @keyup.enter="handleConfirmPinEnter"
        />
        <p v-if="errors.confirmPin" class="mt-2 text-sm text-red-500">
          {{ errors.confirmPin }}
        </p>
      </div>
    </div>
    <div class="mt-6 flex gap-4">
      <BaseButton variant="secondary" @click="handleBack"> Back </BaseButton>
      <BaseButton variant="primary" :disabled="loading" @click="handleFinish">
        <span v-if="!loading">Register</span>
        <span v-else class="flex items-center justify-center gap-2">
          <BaseLoader size="sm" />
          Registering...
        </span>
      </BaseButton>
    </div>
  </div>
</template>

<style scoped></style>
